"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

const DRIVER_COLORS = [
  "#92140C", // pennred
  "#BE7C4D", // caramel
  "#BE5A38", // jasper
  "#353238", // jet
  "#C1B4AE", // silver
  "#F59E0B", // amber
  "#10B981", // emerald
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#F97316", // orange
  "#06B6D4", // cyan
  "#84CC16", // lime
  "#EF4444", // red
  "#6366F1", // indigo
]

interface DriverPointsChartProps {
  driverPointsMap: Map<number, any[]>
  driversData: any[]
}

export function DriverPointsChart({ driverPointsMap, driversData }: DriverPointsChartProps) {
  const [visibleDrivers, setVisibleDrivers] = useState<Set<number>>(
    new Set(Array.from(driverPointsMap.keys()).slice(0, 8)), // Show top 8 initially
  )

  // Prepare chart data
  const maxRounds = Math.max(
    ...Array.from(driverPointsMap.values())
      .flat()
      .map((p) => p.round),
  )
  const chartData = []

  for (let round = 1; round <= maxRounds; round++) {
    const roundData: any = { round }

    driverPointsMap.forEach((points, driverNumber) => {
      const pointsAtRound = points.find((p) => p.round === round)
      const driver = driversData.find((d) => d.driver_number === driverNumber)
      const driverKey = driver?.name_acronym || `#${driverNumber}`
      roundData[driverKey] = pointsAtRound ? pointsAtRound.points : null
    })

    chartData.push(roundData)
  }

  const toggleDriver = (driverNumber: number) => {
    const newVisible = new Set(visibleDrivers)
    if (newVisible.has(driverNumber)) {
      newVisible.delete(driverNumber)
    } else {
      newVisible.add(driverNumber)
    }
    setVisibleDrivers(newVisible)
  }

  const showAll = () => {
    setVisibleDrivers(new Set(Array.from(driverPointsMap.keys())))
  }

  const hideAll = () => {
    setVisibleDrivers(new Set())
  }

  return (
    <div className="space-y-6">
      {/* Driver Toggle Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-jet">driver visibility</h3>
          <div className="space-x-2">
            <Button
              onClick={showAll}
              size="sm"
              variant="outline"
              className="border-jet/30 text-jet hover:bg-caramel hover:text-white bg-transparent"
            >
              <Eye className="h-4 w-4 mr-1" />
              show all
            </Button>
            <Button
              onClick={hideAll}
              size="sm"
              variant="outline"
              className="border-jet/30 text-jet hover:bg-pennred hover:text-white bg-transparent"
            >
              <EyeOff className="h-4 w-4 mr-1" />
              hide all
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.from(driverPointsMap.keys()).map((driverNumber, index) => {
            const driver = driversData.find((d) => d.driver_number === driverNumber)
            const isVisible = visibleDrivers.has(driverNumber)
            const color = DRIVER_COLORS[index % DRIVER_COLORS.length]

            return (
              <button
                key={driverNumber}
                onClick={() => toggleDriver(driverNumber)}
                className={`transition-all duration-200 hover:scale-105 ${isVisible ? "opacity-100" : "opacity-50"}`}
              >
                <Badge
                  variant={isVisible ? "default" : "outline"}
                  className={`font-mono ${
                    isVisible ? "text-white border-0" : "border-jet/30 text-jet hover:bg-jet hover:text-white"
                  }`}
                  style={isVisible ? { backgroundColor: color } : {}}
                >
                  {driver?.name_acronym || `#${driverNumber}`}
                </Badge>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#353238" opacity={0.2} />
            <XAxis
              dataKey="round"
              stroke="#353238"
              fontSize={12}
              fontFamily="monospace"
              label={{ value: "Round", position: "insideBottom", offset: -10, style: { fill: "#353238" } }}
            />
            <YAxis
              stroke="#353238"
              fontSize={12}
              fontFamily="monospace"
              label={{ value: "Points", angle: -90, position: "insideLeft", style: { fill: "#353238" } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #353238",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#353238", fontWeight: "bold" }}
            />
            <Legend wrapperStyle={{ fontFamily: "monospace", fontSize: "12px" }} />

            {Array.from(driverPointsMap.keys()).map((driverNumber, index) => {
              const driver = driversData.find((d) => d.driver_number === driverNumber)
              const driverKey = driver?.name_acronym || `#${driverNumber}`
              const isVisible = visibleDrivers.has(driverNumber)
              const color = DRIVER_COLORS[index % DRIVER_COLORS.length]

              if (!isVisible) return null

              return (
                <Line
                  key={driverNumber}
                  type="monotone"
                  dataKey={driverKey}
                  stroke={color}
                  strokeWidth={3}
                  dot={{ fill: color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: "white" }}
                  connectNulls={false}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
