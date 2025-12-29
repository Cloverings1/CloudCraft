'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface ConsoleTerminalProps {
  serverId: string;
}

interface ConsoleLine {
  id: number;
  text: string;
  timestamp: Date;
}

type ConnectionMode = 'websocket' | 'polling' | 'disconnected';

export function ConsoleTerminal({ serverId }: ConsoleTerminalProps) {
  const [lines, setLines] = useState<ConsoleLine[]>([]);
  const [command, setCommand] = useState('');
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ConnectionMode>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const commandHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const lastLogLengthRef = useRef(0);
  const lineCounterRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const addLine = useCallback((text: string) => {
    lineCounterRef.current += 1;
    const id = lineCounterRef.current;
    setLines(prev => {
      const newLines = [...prev, { id, text, timestamp: new Date() }];
      // Keep last 500 lines
      if (newLines.length > 500) {
        return newLines.slice(-500);
      }
      return newLines;
    });
  }, []);

  // Polling fallback - fetch logs from API
  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`/api/servers/${serverId}/logs`);
      if (!res.ok) return;

      const { logs } = await res.json();
      if (logs && logs.length > lastLogLengthRef.current) {
        // Add only new lines
        const newLines = logs.slice(lastLogLengthRef.current);
        newLines.forEach((line: string) => {
          if (line.trim()) addLine(line);
        });
        lastLogLengthRef.current = logs.length;
      }
    } catch {
      // Silently fail - polling will retry
    }
  }, [serverId, addLine]);

  const startPolling = useCallback(() => {
    // Prevent starting polling multiple times
    if (mode === 'polling') return;

    setMode('polling');
    setConnected(true);
    setConnecting(false);
    setError(null);
    addLine('[System] Using polling mode (WebSocket unavailable)');

    // Initial fetch
    fetchLogs();

    // Poll every 2 seconds
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(fetchLogs, 2000);
  }, [addLine, fetchLogs, mode]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const connectWebSocket = useCallback(async () => {
    setConnecting(true);
    setError(null);

    try {
      // Get WebSocket credentials from our API
      const res = await fetch(`/api/servers/${serverId}/websocket`);
      if (!res.ok) {
        throw new Error('Failed to get WebSocket credentials');
      }
      const { url, token } = await res.json();

      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Connect to Pterodactyl WebSocket
      const ws = new WebSocket(url);
      wsRef.current = ws;

      // Set a connection timeout - if no auth success in 5s, fall back to polling
      const connectionTimeout = setTimeout(() => {
        if (!connected) {
          ws.close();
          startPolling();
        }
      }, 5000);

      ws.onopen = () => {
        // Authenticate with the panel
        ws.send(JSON.stringify({
          event: 'auth',
          args: [token],
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.event) {
            case 'auth success':
              clearTimeout(connectionTimeout);
              setMode('websocket');
              setConnected(true);
              setConnecting(false);
              addLine('[System] Connected to server console (live)');
              // Request logs
              ws.send(JSON.stringify({ event: 'send logs', args: [null] }));
              break;

            case 'console output':
              if (data.args && data.args[0]) {
                // Handle ANSI codes and add line
                const text = data.args[0];
                addLine(text);
              }
              break;

            case 'status':
              if (data.args && data.args[0]) {
                addLine(`[System] Server status: ${data.args[0]}`);
              }
              break;

            case 'stats':
              // Ignore stats events - handled by ServerOverview
              break;

            case 'token expiring':
              // Reconnect before token expires
              connectWebSocket();
              break;

            case 'token expired':
              setConnected(false);
              addLine('[System] Session expired, reconnecting...');
              connectWebSocket();
              break;

            default:
              // Handle other events if needed
              break;
          }
        } catch {
          // Not JSON, treat as raw output
          addLine(event.data);
        }
      };

      ws.onerror = () => {
        clearTimeout(connectionTimeout);
        // Fall back to polling instead of showing error
        startPolling();
      };

      ws.onclose = () => {
        clearTimeout(connectionTimeout);
        if (mode === 'websocket') {
          setConnected(false);
          setConnecting(false);
        }
      };
    } catch {
      // Fall back to polling
      startPolling();
    }
  }, [serverId, addLine, connected, mode, startPolling]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      stopPolling();
    };
  }, [connectWebSocket, stopPolling]);

  useEffect(() => {
    scrollToBottom();
  }, [lines, scrollToBottom]);

  const sendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    // Add to history
    commandHistoryRef.current.unshift(command);
    if (commandHistoryRef.current.length > 50) {
      commandHistoryRef.current.pop();
    }
    historyIndexRef.current = -1;

    // Send via WebSocket if in websocket mode, otherwise via API
    if (mode === 'websocket' && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        event: 'send command',
        args: [command],
      }));
    } else {
      // Use API for polling mode or when WebSocket isn't ready
      try {
        const res = await fetch(`/api/servers/${serverId}/command`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command }),
        });
        if (!res.ok) {
          throw new Error('Failed to send command');
        }
        addLine(`[Command sent]`);
      } catch (err) {
        addLine(`[Error] ${err instanceof Error ? err.message : 'Failed to send command'}`);
      }
    }

    addLine(`> ${command}`);
    setCommand('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndexRef.current < commandHistoryRef.current.length - 1) {
        historyIndexRef.current += 1;
        setCommand(commandHistoryRef.current[historyIndexRef.current]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndexRef.current > 0) {
        historyIndexRef.current -= 1;
        setCommand(commandHistoryRef.current[historyIndexRef.current]);
      } else if (historyIndexRef.current === 0) {
        historyIndexRef.current = -1;
        setCommand('');
      }
    }
  };

  // Parse ANSI codes to HTML (basic support)
  const parseAnsi = (text: string) => {
    // Remove ANSI codes for now - could be enhanced for color support
    return text.replace(/\x1b\[[0-9;]*m/g, '');
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--white-6)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-[13px] text-[var(--text-muted)]">Server Console</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${connected ? (mode === 'websocket' ? 'bg-emerald-500' : 'bg-blue-500') : connecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`}></span>
          <span className="text-[12px] text-[var(--text-muted)]">
            {connected
              ? (mode === 'websocket' ? 'Live' : 'Polling')
              : connecting
                ? 'Connecting...'
                : 'Disconnected'}
          </span>
          {!connected && !connecting && (
            <button
              onClick={connectWebSocket}
              className="text-[12px] text-[var(--accent)] hover:underline ml-2"
            >
              Reconnect
            </button>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={terminalRef}
        className="h-[500px] overflow-y-auto bg-[#0a0a0a] p-4 font-mono text-[13px] leading-relaxed"
      >
        {error && (
          <div className="text-red-400 mb-4">
            Error: {error}
          </div>
        )}
        {lines.length === 0 && !error && (
          <div className="text-[var(--text-muted)]">
            {connecting ? 'Connecting to server console...' : 'Waiting for output...'}
          </div>
        )}
        {lines.map((line) => (
          <div key={line.id} className="text-[#e5e5e5] whitespace-pre-wrap break-all">
            {parseAnsi(line.text)}
          </div>
        ))}
      </div>

      {/* Command Input */}
      <form onSubmit={sendCommand} className="border-t border-[var(--white-6)]">
        <div className="flex items-center">
          <span className="text-[var(--accent)] px-4 font-mono text-[14px]">$</span>
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            className="flex-1 bg-transparent border-none outline-none py-4 pr-4 text-[14px] text-[var(--text-primary)] font-mono placeholder:text-[var(--text-muted)]"
            disabled={!connected && !connecting}
          />
          <button
            type="submit"
            disabled={!command.trim() || (!connected && !connecting)}
            className="px-4 py-2 mr-2 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
