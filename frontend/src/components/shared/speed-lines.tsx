export function SpeedLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity">
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-jasper to-transparent animate-speed-lines"></div>
      <div
        className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-jasper to-transparent animate-speed-lines"
        style={{ animationDelay: "0.3s" }}
      ></div>
      <div
        className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-jasper to-transparent animate-speed-lines"
        style={{ animationDelay: "0.6s" }}
      ></div>
    </div>
  )
}