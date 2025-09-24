import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { Trophy, Clock, Check, Activity } from "lucide-react"
import Image from "next/image"
import { getPodiumData, getDriverData } from "@/lib/api"
import { formatTime, formatGap } from "@/lib/format"

export default async function HomePage() {
  const podiumData = await getPodiumData()

  // Fetch driver data for each podium finisher
  const driversData = await Promise.all(podiumData.results.map((result) => getDriverData(result.driver_number)))

  // Check if this is a race or practice session based on points
  const isRace = podiumData.results.some(result => result.points > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver via-white to-silver font-mono">
      {/* Header */}
      <Header title="f1-predictor" subtitle="race analytics" currentPage="home" />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 animate-fade-in-up">
          <h2 className="text-5xl font-bold text-jet mb-4">
            latest {isRace ? 'podium' : 'practice results'}
          </h2>
          <p className="text-xl text-jet/70 max-w-2xl">
            formula 1 {isRace ? 'race results and driver statistics' : 'practice session timing'}
          </p>
        </div>

        {/* Results */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid gap-6">
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
                  
                  <CardContent className="p-8 animate-slide-in-left relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-6">
                          <div
                            className={`w-16 h-16 bg-jet rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg transform  transition-transform duration-300`}
                          >
                            {result.position}
                          </div>
                          {driver?.headshot_url && (
                            <div className="w-20 h-20 relative">
                              <Image
                                src={driver.headshot_url || "/placeholder.svg"}
                                alt={driver.full_name || `Driver #${result.driver_number}`}
                                fill
                                className="rounded-full object-cover shadow-lg ring-4 ring-white group-hover:ring-pennred transition-all duration-300"
                                crossOrigin="anonymous"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-jet mb-2 group-hover:text-pennred transition-colors duration-300">
                            {driver?.full_name || `driver #${result.driver_number}`}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-jet/70">
                            <Badge variant="outline" className="border-jet/30 text-jet font-mono bg-white/50">
                              #{result.driver_number}
                            </Badge>
                            {driver?.team_name && <span className="text-caramel font-medium">{driver.team_name}</span>}
                            <span className="flex items-center space-x-1">
                              <Check className="h-4 w-4" />
                              <span>{result.number_of_laps} laps</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        {isRace ? (
                          // Show points for races
                          <div
                            className={`text-3xl font-bold ${style.accent} mb-3 group-hover:scale-110 transition-transform duration-300`}
                          >
                            {result.points} pts
                          </div>
                        ) : (
                          // Show "P" + position for practice sessions
                          <div
                            className={`text-3xl font-bold ${style.accent} mb-3 group-hover:scale-110 transition-transform duration-300`}
                          >
                            P{result.position}
                          </div>
                        )}
                        <div className="space-y-2 text-sm text-jet/70">
                          <div className="flex items-center space-x-2 justify-end">
                            <Clock className="h-4 w-4" />
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

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-silver/30 group">
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
              {isRace ? (
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              ) : (
                <Activity className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              )}
              <h3 className="text-xl font-bold text-jet mb-3">
                {isRace ? 'race winner' : 'fastest lap'}
              </h3>
              <p className="text-jet/70 font-mono">
                {driversData[0]?.full_name || `driver #${podiumData.results[0].driver_number}`}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-silver/30 group">
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pennred/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
              <h3 className="text-xl font-bold text-jet mb-3">total laps</h3>
              <p className="text-jet/70 font-mono">{podiumData.results[0].number_of_laps}</p>
            </CardContent>
          </Card>

          <Card className="border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-silver/30 group">
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-jasper/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
              <Clock className="h-12 w-12 text-jasper mx-auto mb-4" />
              <h3 className="text-xl font-bold text-jet mb-3">
                {isRace ? 'race time' : 'session time'}
              </h3>
              <p className="text-jet/70 font-mono">{formatTime(podiumData.results[0].duration)}</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}