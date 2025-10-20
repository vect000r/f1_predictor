import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { Trophy, Clock, Check, Activity } from "lucide-react"
import Image from "next/image"
import { getPodiumData, getDriverData } from "@/lib/api"
import { formatTime, formatGap } from "@/lib/format"

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const podiumData = await getPodiumData()

  if (!podiumData.results || podiumData.results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-silver via-white to-silver font-mono">
        <Header title="f1-predictor" subtitle="race analytics" currentPage="home" />

        <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Activity className="h-16 w-16 sm:h-20 sm:w-20 text-jet/30 mb-6 animate-pulse" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-jet mb-4">
              No Recent Race Data
            </h2>
            <p className="text-base sm:text-lg text-jet/70 max-w-md">
              {podiumData.message || "Check back after the next Formula 1 session!"}
            </p>
            <p className="text-sm text-jet/50 mt-4">
              Race results will appear here once a session is completed.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  // Fetch driver data for each podium finisher
  const driversData = await Promise.all(podiumData.results.map((result) => getDriverData(result.driver_number)))

  // Check if this is a race or practice session based on points
  const isRace = podiumData.results.some(result => result.points > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver via-white to-silver font-mono">
      <Header title="f1-predictor" subtitle="race analytics" currentPage="home" />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-jet mb-3 sm:mb-4">
            latest {isRace ? 'podium' : 'practice results'}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-jet/70 max-w-2xl">
            formula 1 {isRace ? 'race results and driver statistics' : 'practice session timing'}
          </p>
        </div>

        <div className="max-w-5xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="grid gap-4 sm:gap-6">
            {podiumData.results.map((result, index) => {
              const driver = driversData[index]
              const positionStyles = {
                1: {
                  border: "border-l-yellow-500",
                  bg: "bg-gradient-to-r from-yellow-50 to-white",
                  accent: "text-yellow-600",
                },
                2: {
                  border: "border-l-caramel",
                  bg: "bg-gradient-to-r from-gray-50 to-white",
                  accent: "text-caramel",
                },
                3: {
                  border: "border-l-jasper",
                  bg: "bg-gradient-to-r from-orange-50 to-white",
                  accent: "text-jasper",
                },
              }

              const style = positionStyles[result.position as keyof typeof positionStyles]
              const animationDelay = `${index * 0.2}s`

              return (
                <Card
                  key={result.position}
                  className={`border-l-4 ${style.border} ${style.bg} shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group relative overflow-hidden`}
                  style={{ animationDelay }}
                >

                  <CardContent className="p-4 sm:p-6 lg:p-8 animate-slide-in-left relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                      <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 flex-shrink-0">
                          <div
                            className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-jet rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-lg transform transition-transform duration-300`}
                          >
                            {result.position}
                          </div>
                          {driver?.headshot_url && (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 relative flex-shrink-0">
                              <Image
                                src={`/drivers/${driver.driver_number}.png` || "/placeholder.svg"}
                                alt={driver.full_name || `Driver #${result.driver_number}`}
                                fill
                                className="rounded-full object-cover shadow-lg ring-2 sm:ring-4 ring-white group-hover:ring-pennred transition-all duration-300"
                                crossOrigin="anonymous"
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-jet mb-1 sm:mb-2 group-hover:text-pennred transition-colors duration-300 truncate">
                            {driver?.full_name || `driver #${result.driver_number}`}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-jet/70">
                            <Badge variant="outline" className="border-jet/30 text-jet font-mono bg-white/50">
                              #{result.driver_number}
                            </Badge>
                            {driver?.team_name && (
                              <span className="text-caramel font-medium truncate max-w-[150px] sm:max-w-none">
                                {driver.team_name}
                              </span>
                            )}
                            <span className="flex items-center space-x-1 flex-shrink-0">
                              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span>{result.number_of_laps} laps</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start sm:text-right gap-4 sm:gap-0">
                        {isRace ? (
                          <div
                            className={`text-2xl sm:text-2xl lg:text-3xl font-bold ${style.accent} sm:mb-3 group-hover:scale-110 transition-transform duration-300`}
                          >
                            {result.points} pts
                          </div>
                        ) : (
                          <div
                            className={`text-2xl sm:text-2xl lg:text-3xl font-bold ${style.accent} sm:mb-3 group-hover:scale-110 transition-transform duration-300`}
                          >
                            P{result.position}
                          </div>
                        )}
                        <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-2 text-xs sm:text-sm text-jet/70">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="font-mono">{formatTime(result.duration)}</span>
                          </div>
                          <div className="font-mono text-pennred font-semibold">{formatGap(result.gap_to_leader)}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
          <Card className="border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-silver/30 group">
            <CardContent className="p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
              {isRace ? (
                <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 mx-auto mb-3 sm:mb-4" />
              ) : (
                <Activity className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 mx-auto mb-3 sm:mb-4" />
              )}
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-jet mb-2 sm:mb-3">
                {isRace ? 'race winner' : 'fastest lap'}
              </h3>
              <p className="text-sm sm:text-base text-jet/70 font-mono truncate">
                {driversData[0]?.full_name || `driver #${podiumData.results[0].driver_number}`}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-silver/30 group">
            <CardContent className="p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pennred/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-jet mb-2 sm:mb-3">total laps</h3>
              <p className="text-sm sm:text-base text-jet/70 font-mono">{podiumData.results[0].number_of_laps}</p>
            </CardContent>
          </Card>

          <Card className="border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-silver/30 group sm:col-span-2 md:col-span-1">
            <CardContent className="p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-jasper/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
              <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-jasper mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-jet mb-2 sm:mb-3">
                {isRace ? 'race time' : 'session time'}
              </h3>
              <p className="text-sm sm:text-base text-jet/70 font-mono">{formatTime(podiumData.results[0].duration)}</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}