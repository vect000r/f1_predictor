export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const ms = Math.floor((seconds % 1) * 1000)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`
}

export function formatGap(gap: number | null | undefined): string {
  if (gap === null || gap === undefined) {
    return "N/A";
  }
  
  if (typeof gap !== 'number' || isNaN(gap)) {
    return "Invalid";
  }
  
  if (gap === 0) {
    return "Leader";
  }
  
  return `+${gap.toFixed(3)}s`;
}
