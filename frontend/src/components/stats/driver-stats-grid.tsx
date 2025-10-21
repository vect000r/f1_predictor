"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Trophy } from "lucide-react"
import Image from "next/image"

interface DriverStatsGridProps {
  driverPointsMap: Map<number, any[]>
  driversData: any[]
  currentStandings: any[]
}

export function DriverStatsGrid({ driverPointsMap, driversData, currentStandings }: DriverStatsGridProps) {
  const getDriverStats = (driverNumber: number) => {
    const points = driverPointsMap.get(driverNumber) || []
    const driver = driversData.find((d) => d.driver_number === driverNumber)

    if (!driver || points.length === 0) return null

    const totalPoints = points[points.length - 1]?.points || 0
    const averagePointsPerRound = totalPoints / points.length

    // Calculate trend (last 3 rounds vs previous 3)
    const recentRounds = points.slice(-3)
    const previousRounds = points.slice(-6, -3)

    let trend = "stable"
    if (recentRounds.length >= 2 && previousRounds.length >= 2) {
      const recentAvg = recentRounds.reduce((sum, p) => sum + p.points, 0) / recentRounds.length
      const previousAvg = previousRounds.reduce((sum, p) => sum + p.points, 0) / previousRounds.length

      if (recentAvg > previousAvg * 1.1) trend = "up"
      else if (recentAvg < previousAvg * 0.9) trend = "down"
    }

    return {
      driver,
      totalPoints,
      averagePointsPerRound,
      roundsCompleted: points.length,
      trend,
      position: 0,
    }
  }

  const driverStats = Array.from(driverPointsMap.keys())
    .map(getDriverStats)
    .filter((stats): stats is NonNullable<typeof stats> => stats !== null)
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((stats, index) => ({
      ...stats,
      position: index + 1
    }))

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-jet mb-6">detailed driver statistics</h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {driverStats.map((stats, index) => (
          <Card
            key={stats.driver.driver_number}
            className="bg-gradient-to-br from-white to-silver/30 border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group relative overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      stats.position === 1
                        ? "bg-yellow-500"
                        : stats.position === 2
                          ? "bg-gray-400"
                          : stats.position === 3
                            ? "bg-amber-600"
                            : "bg-jet"
                    }`}
                  >
                    {stats.position}
                  </div>
                  {stats.position <= 3 && (
                    <Trophy
                      className={`h-5 w-5 ${
                        stats.position === 1
                          ? "text-yellow-500"
                          : stats.position === 2
                            ? "text-gray-400"
                            : "text-amber-600"
                      }`}
                    />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(stats.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(stats.trend)}`}>{stats.trend}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                {stats.driver?.headshot_url && (
                  <div className="w-16 h-16 relative">
                    <Image
                      src={`/drivers/${stats.driver.driver_number}.png` || "/placeholder.svg"}
                      alt={stats.driver?.full_name || `Driver #${stats.driver?.driver_number}`}
                      fill
                      className="rounded-full object-cover shadow-lg ring-2 ring-white group-hover:ring-pennred transition-all duration-300"
                      crossOrigin="anonymous"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-jet group-hover:text-pennred transition-colors">
                    {stats.driver?.full_name || `Driver #${stats.driver?.driver_number || "Unknown"}`}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="border-jet/30 text-jet font-mono text-xs">
                      #{stats.driver.driver_number}
                    </Badge>
                    <span className="text-xs text-caramel font-medium">{stats.driver.team_name}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-jet/60 uppercase tracking-wide text-xs">total points</p>
                  <p className="text-xl font-bold text-jet">{stats.totalPoints}</p>
                </div>
                <div>
                  <p className="text-jet/60 uppercase tracking-wide text-xs">avg/round</p>
                  <p className="text-xl font-bold text-jet">{stats.averagePointsPerRound.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-jet/60 uppercase tracking-wide text-xs">rounds</p>
                  <p className="text-lg font-semibold text-jet">{stats.roundsCompleted}</p>
                </div>
                <div>
                  <p className="text-jet/60 uppercase tracking-wide text-xs">position</p>
                  <p className="text-lg font-semibold text-jet">P{stats.position}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
