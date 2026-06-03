export function getPercentageColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-rose-500";
}

export function getMetricColor(val: number): string {
  if (val >= 80) return "bg-gradient-to-r from-purple-600 to-pink-500";
  if (val >= 60) return "bg-gradient-to-r from-blue-500 to-purple-500";
  return "bg-gradient-to-r from-rose-500 to-amber-500";
}

export function getScoreBadgeClass(score: number): string {
  return score >= 80
    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
    : "bg-amber-500/10 text-amber-400 border border-amber-500/30";
}
