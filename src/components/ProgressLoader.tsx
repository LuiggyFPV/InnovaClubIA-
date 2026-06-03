import React from "react";

interface ProgressLoaderProps {
  title: string;
  remainingLabel: string;
  remaining: number;
  progress: number;
  logs: string[];
  barBgClass?: string;
  barFillClass?: string;
  titleClass?: string;
  logAccentClass?: string;
}

export default function ProgressLoader({
  title,
  remainingLabel,
  remaining,
  progress,
  logs,
  barBgClass = "bg-purple-950",
  barFillClass = "bg-gradient-to-r from-purple-500 to-pink-500",
  titleClass = "text-[#FF2EFB]",
  logAccentClass = "text-purple-400",
}: ProgressLoaderProps) {
  return (
    <div className="p-4 rounded-xl bg-black/40 border border-purple-500/30 space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase">
        <span className={titleClass}>{title}</span>
        <span className={titleClass}>
          {remainingLabel}: {remaining}s
        </span>
      </div>
      <div className={`w-full h-2 ${barBgClass} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${barFillClass} rounded-full`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-[11px] font-mono text-gray-300 space-y-1 bg-black/55 p-3 rounded-lg max-h-36 overflow-y-auto">
        {logs.map((log, i) => (
          <div key={i}>
            <span className={logAccentClass}>▸</span> {log}
          </div>
        ))}
      </div>
    </div>
  );
}
