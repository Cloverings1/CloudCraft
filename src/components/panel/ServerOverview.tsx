'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface ServerOverviewProps {
  serverId: string;
}

interface ServerData {
  name: string;
  identifier: string;
  uuid: string;
  description: string;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
  };
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  is_suspended: boolean;
  is_installing: boolean;
  sftp_details: {
    ip: string;
    port: number;
  };
  allocations?: Array<{
    ip: string;
    port: number;
    is_default: boolean;
  }>;
}

interface ResourceData {
  current_state: string;
  is_suspended: boolean;
  resources: {
    memory_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
    uptime: number;
  };
}

type PowerAction = 'start' | 'stop' | 'restart' | 'kill';
type ServerState = 'running' | 'starting' | 'stopping' | 'offline';

export function ServerOverview({ serverId }: ServerOverviewProps) {
  const [server, setServer] = useState<ServerData | null>(null);
  const [resources, setResources] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PowerAction | null>(null);
  const [optimisticState, setOptimisticState] = useState<ServerState | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(true);
  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoized fetch function
  const fetchData = useCallback(async (signal?: AbortSignal) => {
    try {
      const res = await fetch(`/api/servers/${serverId}`, { signal });
      if (!res.ok) throw new Error('Failed to fetch server data');
      const data = await res.json();

      if (data.installing) {
        retryCountRef.current += 1;
        return;
      }

      setServer(data.server);
      setResources(data.resources);
      setError(null);
      setIsSettingUp(false);

      // Clear optimistic state once real state is confirmed
      if (optimisticState) {
        const realState = data.resources?.current_state;
        if (realState === optimisticState ||
            (optimisticState === 'starting' && realState === 'running') ||
            (optimisticState === 'stopping' && realState === 'offline')) {
          setOptimisticState(null);
          setPendingAction(null);
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;

      if (isSettingUp && retryCountRef.current < 30) {
        retryCountRef.current += 1;
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsSettingUp(false);
      }
    } finally {
      setLoading(false);
    }
  }, [serverId, isSettingUp, optimisticState]);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    fetchData(abortControllerRef.current.signal);

    const interval = setInterval(() => {
      fetchData(abortControllerRef.current?.signal);
    }, isSettingUp ? 2000 : 3000); // Faster polling: 3s instead of 5s

    return () => {
      clearInterval(interval);
      abortControllerRef.current?.abort();
    };
  }, [fetchData, isSettingUp]);

  // Optimistic power action with instant feedback
  const sendPowerAction = useCallback(async (action: PowerAction) => {
    // Instant optimistic update
    setPendingAction(action);

    const newOptimisticState: ServerState =
      action === 'start' ? 'starting' :
      action === 'stop' || action === 'kill' ? 'stopping' :
      action === 'restart' ? 'stopping' : 'offline';

    setOptimisticState(newOptimisticState);

    try {
      const res = await fetch(`/api/servers/${serverId}/power`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        throw new Error('Failed to send power action');
      }

      // For restart, transition through stopping -> starting
      if (action === 'restart') {
        setTimeout(() => setOptimisticState('starting'), 1500);
      }
    } catch (err) {
      // Revert optimistic update on error
      setOptimisticState(null);
      setPendingAction(null);
      setError(err instanceof Error ? err.message : 'Failed to send command');
    }
  }, [serverId]);

  // Copy to clipboard with feedback
  const copyAddress = useCallback((address: string) => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  // Memoized formatters
  const formatBytes = useMemo(() => (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  const formatUptime = useMemo(() => (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
  }, []);

  // Computed values
  const currentState = (optimisticState || resources?.current_state || 'offline') as ServerState;
  const isOnline = currentState === 'running';
  const isTransitioning = currentState === 'starting' || currentState === 'stopping';

  const stats = useMemo(() => {
    const memoryUsed = resources?.resources.memory_bytes || 0;
    const memoryLimit = (server?.limits.memory || 0) * 1024 * 1024;
    const cpuUsed = resources?.resources.cpu_absolute || 0;
    const cpuLimit = server?.limits.cpu || 100;
    const diskUsed = resources?.resources.disk_bytes || 0;
    const diskLimit = (server?.limits.disk || 0) * 1024 * 1024;

    return {
      memoryUsed,
      memoryLimit,
      memoryPercent: memoryLimit > 0 ? (memoryUsed / memoryLimit) * 100 : 0,
      cpuUsed,
      cpuLimit,
      cpuPercent: cpuLimit > 0 ? (cpuUsed / cpuLimit) * 100 : 0,
      diskUsed,
      diskLimit,
      diskPercent: diskLimit > 0 ? (diskUsed / diskLimit) * 100 : 0,
    };
  }, [resources, server]);

  const serverAddress = useMemo(() => {
    const SERVER_IP = '69.164.203.24';
    const formatIP = (ip: string) => ip === '0.0.0.0' ? SERVER_IP : ip;
    const defaultAllocation = server?.allocations?.find(a => a.is_default);

    return defaultAllocation
      ? `${formatIP(defaultAllocation.ip)}:${defaultAllocation.port}`
      : server?.sftp_details
        ? `${formatIP(server.sftp_details.ip)}:25565`
        : 'Not available';
  }, [server]);

  const statusConfig = useMemo(() => ({
    running: { color: 'bg-emerald-500', text: 'Online', pulse: false },
    starting: { color: 'bg-amber-500', text: 'Starting...', pulse: true },
    stopping: { color: 'bg-amber-500', text: 'Stopping...', pulse: true },
    offline: { color: 'bg-zinc-500', text: 'Offline', pulse: false },
  }), []);

  // Loading state
  if (loading || (isSettingUp && !server)) {
    return (
      <div className="space-y-6">
        <div className="glass-card p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[var(--accent)] animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-[18px] font-medium text-[var(--text-primary)] mb-2">
              Setting Up Your Server
            </h3>
            <p className="text-[14px] text-[var(--text-secondary)] mb-4">
              We&apos;re preparing your Minecraft server. This usually takes 10-30 seconds...
            </p>
            <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)]">
              <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse"></div>
              Installing server files
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-4 bg-[var(--white-6)] rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-[var(--white-6)] rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 border-red-500/20">
        <div className="flex items-center gap-3 text-red-400">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
        <button onClick={() => fetchData()} className="mt-4 btn-secondary text-[14px]">
          Retry
        </button>
      </div>
    );
  }

  const status = statusConfig[currentState];

  return (
    <div className="space-y-6">
      {/* Status & Power Controls */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-3 h-3 rounded-full ${status.color} ${status.pulse ? 'animate-pulse' : ''} transition-colors duration-300`}></div>
            <div>
              <h2 className="text-[18px] font-medium text-[var(--text-primary)]">
                {status.text}
              </h2>
              {isOnline && resources?.resources.uptime && (
                <p className="text-[13px] text-[var(--text-muted)]">
                  Uptime: {formatUptime(Math.floor(resources.resources.uptime / 1000))}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isOnline && currentState !== 'starting' ? (
              <button
                onClick={() => sendPowerAction('start')}
                disabled={!!pendingAction}
                className="btn-primary text-[14px] flex items-center gap-2 min-w-[100px] justify-center transition-all duration-150 active:scale-95"
              >
                {pendingAction === 'start' ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
                Start
              </button>
            ) : isTransitioning ? (
              <button
                disabled
                className="btn-secondary text-[14px] flex items-center gap-2 min-w-[100px] justify-center opacity-50 cursor-not-allowed"
              >
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {currentState === 'starting' ? 'Starting...' : 'Stopping...'}
              </button>
            ) : (
              <>
                <button
                  onClick={() => sendPowerAction('restart')}
                  disabled={!!pendingAction}
                  className="btn-secondary text-[14px] flex items-center gap-2 transition-all duration-150 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Restart
                </button>
                <button
                  onClick={() => sendPowerAction('stop')}
                  disabled={!!pendingAction}
                  className="btn-secondary text-[14px] flex items-center gap-2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all duration-150 active:scale-95"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                  Stop
                </button>
              </>
            )}
          </div>
        </div>

        {/* Server Address */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--white-4)] border border-[var(--white-6)]">
          <svg className="w-5 h-5 text-[var(--accent)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-[var(--text-muted)] mb-0.5">Server Address</p>
            <code className="text-[14px] text-[var(--text-primary)] truncate block">{serverAddress}</code>
          </div>
          <button
            onClick={() => copyAddress(serverAddress)}
            className="p-2 rounded-lg hover:bg-[var(--white-6)] transition-all duration-150 active:scale-95 flex-shrink-0"
            title="Copy address"
          >
            {copied ? (
              <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Resource Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] text-[var(--text-secondary)]">CPU Usage</span>
            <span className="text-[13px] text-[var(--text-muted)]">{stats.cpuLimit}%</span>
          </div>
          <div className="text-[28px] font-light text-[var(--text-primary)] mb-3 tabular-nums">
            {stats.cpuUsed.toFixed(1)}%
          </div>
          <div className="h-1.5 bg-[var(--white-6)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.min(stats.cpuPercent, 100)}%`,
                backgroundColor: stats.cpuPercent > 90 ? '#ef4444' : stats.cpuPercent > 70 ? '#f59e0b' : 'var(--accent)'
              }}
            ></div>
          </div>
        </div>

        {/* Memory */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] text-[var(--text-secondary)]">Memory</span>
            <span className="text-[13px] text-[var(--text-muted)]">{formatBytes(stats.memoryLimit)}</span>
          </div>
          <div className="text-[28px] font-light text-[var(--text-primary)] mb-3">
            {formatBytes(stats.memoryUsed)}
          </div>
          <div className="h-1.5 bg-[var(--white-6)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${Math.min(stats.memoryPercent, 100)}%`,
                backgroundColor: stats.memoryPercent > 90 ? '#ef4444' : stats.memoryPercent > 70 ? '#f59e0b' : 'var(--accent)'
              }}
            ></div>
          </div>
        </div>

        {/* Disk */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] text-[var(--text-secondary)]">Disk Usage</span>
            <span className="text-[13px] text-[var(--text-muted)]">{formatBytes(stats.diskLimit)}</span>
          </div>
          <div className="text-[28px] font-light text-[var(--text-primary)] mb-3">
            {formatBytes(stats.diskUsed)}
          </div>
          <div className="h-1.5 bg-[var(--white-6)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(stats.diskPercent, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Network Stats */}
      {isOnline && resources?.resources && (
        <div className="glass-card p-6">
          <h3 className="text-[14px] font-medium text-[var(--text-primary)] mb-4">Network</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[12px] text-[var(--text-muted)] mb-1">Inbound</p>
              <p className="text-[18px] font-light text-[var(--text-primary)] tabular-nums">
                {formatBytes(resources.resources.network_rx_bytes)}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-[var(--text-muted)] mb-1">Outbound</p>
              <p className="text-[18px] font-light text-[var(--text-primary)] tabular-nums">
                {formatBytes(resources.resources.network_tx_bytes)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
