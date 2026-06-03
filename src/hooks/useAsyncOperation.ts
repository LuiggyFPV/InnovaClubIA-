import { useState, useRef, useCallback } from "react";

interface AsyncOperationConfig {
  initialProgress: number;
  initialRemaining: number;
  progressStep: number;
  progressMax: number;
  progressIntervalMs: number;
  remainingStep: number;
  remainingMin: number;
  initialLogs: string[];
  scheduledLogs?: { afterCount: number; message: string }[];
  logIntervalMs?: number;
}

interface AsyncOperationState {
  isRunning: boolean;
  progress: number;
  remaining: number;
  logs: string[];
}

interface AsyncOperationActions {
  run: <T>(apiCall: () => Promise<T>) => Promise<{ data: T | null; error: string | null }>;
  appendLog: (message: string) => void;
  setProgress: (value: number) => void;
  setRemaining: (value: number) => void;
}

export function useAsyncOperation(
  config: AsyncOperationConfig
): [AsyncOperationState, AsyncOperationActions] {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const logTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (logTimerRef.current) clearInterval(logTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    logTimerRef.current = null;
    progressTimerRef.current = null;
  }, []);

  const appendLog = useCallback((message: string) => {
    setLogs((prev) => [...prev, message]);
  }, []);

  const run = useCallback(
    async <T>(apiCall: () => Promise<T>): Promise<{ data: T | null; error: string | null }> => {
      setIsRunning(true);
      setProgress(config.initialProgress);
      setRemaining(config.initialRemaining);
      setLogs([...config.initialLogs]);

      if (config.scheduledLogs && config.logIntervalMs) {
        const scheduled = [...config.scheduledLogs];
        let logIndex = 0;
        logTimerRef.current = setInterval(() => {
          if (logIndex < scheduled.length) {
            setLogs((prev) => {
              if (prev.length >= scheduled[logIndex].afterCount) {
                const next = [...prev, scheduled[logIndex].message];
                logIndex++;
                return next;
              }
              return prev;
            });
          }
        }, config.logIntervalMs);
      }

      progressTimerRef.current = setInterval(() => {
        setProgress((prev) => Math.min(prev + config.progressStep, config.progressMax));
        setRemaining((prev) => Math.max(prev - config.remainingStep, config.remainingMin));
      }, config.progressIntervalMs);

      try {
        const data = await apiCall();
        setProgress(100);
        setRemaining(0);
        return { data, error: null };
      } catch (err: any) {
        const message = err.message || "Error desconocido";
        setLogs((prev) => [...prev, `❌ Error: ${message}`]);
        return { data: null, error: message };
      } finally {
        cleanup();
        setIsRunning(false);
      }
    },
    [config, cleanup]
  );

  return [
    { isRunning, progress, remaining, logs },
    { run, appendLog, setProgress, setRemaining },
  ];
}
