import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { DriverPointsChart } from "@/components/charts/driver-points-chart"
import { DriverStatsGrid } from "@/components/stats/driver-stats-grid"
import { TrendingUp, Trophy, Users, BarChart3 } from "lucide-react"
import { getDriverPoints, getAllDrivers } from "@/lib/api"

export default async function StatsPage() {
  const [driverPointsData, driversData] = await Promise.all([getDriverPoints(), getAllDrivers()])

  // Group points by driver
  const driverPointsMap = new Map()
  driverPointsData.forEach((point) => {
    if (!driverPointsMap.has(point.driver_number)) {
      driverPointsMap.set(point.driver_number, [])
    }
    driverPointsMap.get(point.driver_number).push(point)
  })

  // Sort points by round for each driver
  driverPointsMap.forEach((points: any[]) => {
    points.sort((a: any, b: any) => a.round - b.round)
  })

  // Get current standings (latest round points)
  const currentStandings = Array.from(driverPointsMap.entries())
    .map(([driverNumber, points]) => {
      const latestPoints = points[points.length - 1]
      const driver = driversData.find((d) => d.driver_number === driverNumber)
      return {
        driver_number: driverNumber,
        points: latestPoints.points,
        driver: driver,
      }
    })
    .sort((a, b) => b.points - a.points)

  const totalRounds = Math.max(...driverPointsData.map((p) => p.round))

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver via-white to-silver font-mono">
      {/* Header */}
      <Header
        title="statistics"
        subtitle="driver performance analytics"
        icon={<BarChart3 className="h-5 w-5 text-white" />}
        backLink="/"
        backText="home"
        currentPage="stats"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 animate-fade-in-up">
          <h2 className="text-5xl font-bold text-jet mb-4">driver statistics</h2>
          <p className="text-xl text-jet/70 max-w-2xl">
            comprehensive analysis of driver performance throughout the season
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
          <Card className="bg-gradient-to-br from-white to-silver/30 border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pennred/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
              <Trophy className="h-12 w-12 text-pennred mx-auto mb-4 transition-colors duration-300" />
              <h3 className="text-xl font-bold text-jet mb-3">championship leader</h3>
              <p className="text-jet/70 font-mono">
                {currentStandings[0]?.driver?.name_acronym || "N/A"} - {currentStandings[0]?.points || 0} pts
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-silver/30 border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-caramel/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
              <Users className="h-12 w-12 text-caramel mx-auto mb-4 transition-colors duration-300" />
              <h3 className="text-xl font-bold text-jet mb-3">active drivers</h3>
              <p className="text-jet/70 font-mono">{currentStandings.length} drivers</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-silver/30 border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-jasper/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
              <TrendingUp className="h-12 w-12 text-jasper mx-auto mb-4 transition-colors duration-300" />
              <h3 className="text-xl font-bold text-jet mb-3">rounds completed</h3>
              <p className="text-jet/70 font-mono">{totalRounds} rounds</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart */}
        <Card className="bg-gradient-to-r from-white to-silver/30 border border-jet/20 shadow-2xl mb-12 overflow-hidden">
          <CardHeader className="bg-jet text-white">
            <CardTitle className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-caramel" />
              <span>driver points progression</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <DriverPointsChart driverPointsMap={driverPointsMap} driversData={driversData} />
          </CardContent>
        </Card>

        {/* Current Standings */}
        <Card className="bg-gradient-to-r from-white to-silver/30 border border-jet/20 shadow-2xl mb-12 overflow-hidden">
          <CardHeader className="bg-jet text-white">
            <CardTitle className="flex items-center space-x-3">
              <Trophy className="h-6 w-6 text-pennred" />
              <span>current championship standings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-4">
              {currentStandings.slice(0, 10).map((standing, index) => (
                <div
                  key={standing.driver_number}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-silver/20 rounded-lg border border-jet/10 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                            ? "bg-gray-400"
                            : index === 2
                              ? "bg-amber-600"
                              : "bg-jet"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-jet group-hover:text-pennred transition-colors">
                        {standing.driver?.full_name || `Driver #${standing.driver_number}`}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-jet/30 text-jet font-mono">
                          #{standing.driver_number}
                        </Badge>
                        <span className="text-sm text-caramel font-medium">{standing.driver?.team_name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-jet group-hover:text-pennred transition-colors">
                      {standing.points} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Driver Stats Grid */}
        <DriverStatsGrid
          driverPointsMap={driverPointsMap}
          driversData={driversData}
          currentStandings={currentStandings}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}