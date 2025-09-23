import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { SpeedLines } from "@/components/shared/speed-lines"
import { TrendingUp, TrendingDown, Minus, Brain, Clock, Target } from "lucide-react"
import Image from "next/image"
import { getPredictions, getDriverData } from "@/lib/api"

export default async function PredictionsPage() {
  const predictionsData = await getPredictions()

  if (!predictionsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-silver via-white to-silver font-mono">
        <Header title="predictions" subtitle="ai-powered insights" currentPage="predictions" />
        <main className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-jet mb-4">predictions unavailable</h1>
            <p className="text-jet/70">unable to load prediction data</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Convert predictions object to array and sort by predicted position
  const predictions = Object.values(predictionsData.predictions).sort(
    (a, b) => a.predicted_position - b.predicted_position,
  )

  // Fetch driver data for each prediction
  const driversData = await Promise.all(predictions.map((prediction) => getDriverData(prediction.driver_number)))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPositionChange = (current: number, predicted: number) => {
    const change = current - predicted
    if (Math.abs(change) < 0.1) return { icon: Minus, color: "text-jet/60", text: "no change" }
    if (change > 0) return { icon: TrendingUp, color: "text-green-600", text: `+${change.toFixed(1)}` }
    return { icon: TrendingDown, color: "text-red-600", text: change.toFixed(1) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver via-white to-silver font-mono">
      {/* Header */}
      <Header title="predictions" subtitle="ai-powered insights" currentPage="predictions" />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 animate-fade-in-up">
          <h2 className="text-5xl font-bold text-jet mb-4">driver performance predictions</h2>
          <p className="text-xl text-jet/70 max-w-2xl">ai-powered championship position and points forecasts</p>
        </div>

        {/* Model Info */}
        <div className="max-w-5xl mx-auto mb-12">
          <Card className="border border-jet/20 shadow-lg bg-gradient-to-r from-white to-silver/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Brain className="h-8 w-8 text-pennred" />
                  <div>
                    <h3 className="text-lg font-bold text-jet">Model: {predictionsData.model_type}</h3>
                    <p className="text-jet/70 font-mono">machine learning predictions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-jet/60">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono text-sm">updated {formatDate(predictionsData.generated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predictions Grid */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid gap-6">
            {predictions.map((prediction, index) => {
              const driver = driversData[index]
              const positionChange = getPositionChange(prediction.current_position, prediction.predicted_position)
              const animationDelay = `${index * 0.1}s`

              return (
                <Card
                  key={prediction.driver_number}
                  className="border border-jet/20 bg-gradient-to-r from-white to-silver/30 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] group relative overflow-hidden"
                  style={{ animationDelay }}
                >
                  <CardContent className="p-8 animate-slide-in-left relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-6">
                          <div className="w-16 h-16 bg-jet rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg transform transition-transform duration-300">
                            {Math.round(prediction.predicted_position)}
                          </div>
                          {driver?.headshot_url && (
                            <div className="w-20 h-20 relative">
                              <Image
                                src={driver.headshot_url || "/placeholder.svg"}
                                alt={driver.full_name || `Driver #${prediction.driver_number}`}
                                fill
                                className="rounded-full object-cover shadow-lg ring-4 ring-white group-hover:ring-pennred transition-all duration-300"
                                crossOrigin="anonymous"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-jet mb-2 group-hover:text-pennred transition-colors duration-300">
                            {driver?.full_name || `driver #${prediction.driver_number}`}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-jet/70">
                            <Badge variant="outline" className="border-jet/30 text-jet font-mono bg-white/50">
                              #{prediction.driver_number}
                            </Badge>
                            {driver?.team_name && <span className="text-caramel font-medium">{driver.team_name}</span>}
                            <div className="flex items-center space-x-1">
                              <Target className="h-4 w-4" />
                              <span>{Math.round(prediction.confidence * 100)}% confidence</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right space-y-4">
                        {/* Predicted Points */}
                        <div>
                          <div className="text-3xl font-bold text-pennred mb-1 group-hover:scale-110 transition-transform duration-300">
                            {Math.round(prediction.predicted_total_points)} pts
                          </div>
                          <div className="text-sm text-jet/60 font-mono">
                            +{prediction.predicted_points_gain.toFixed(1)} predicted gain
                          </div>
                        </div>

                        {/* Position Change */}
                        <div className="flex items-center justify-end space-x-2">
                          <positionChange.icon className={`h-5 w-5 ${positionChange.color}`} />
                          <span className={`font-mono font-semibold ${positionChange.color}`}>
                            {positionChange.text}
                          </span>
                        </div>

                        {/* Current vs Predicted */}
                        <div className="text-xs text-jet/60 font-mono">
                          <div>
                            current: P{prediction.current_position} • {prediction.current_points} pts
                          </div>
                          <div>predicted: P{prediction.predicted_position.toFixed(1)}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-silver/30 group">
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
              <TrendingUp className="h-12 w-12 text-yellow-500 mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-jet mb-3">predicted leader</h3>
              <p className="text-jet/70 font-mono">
                {driversData[0]?.full_name || `driver #${predictions[0]?.driver_number}`}
              </p>
            </CardContent>
          </Card>

          <Card className="border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-silver/30 group">
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pennred/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
              <Brain className="h-12 w-12 text-pennred mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-jet mb-3">model type</h3>
              <p className="text-jet/70 font-mono">{predictionsData.model_type}</p>
            </CardContent>
          </Card>

          <Card className="border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-silver/30 group">
            <CardContent className="p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-jasper/10 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>
              <Target className="h-12 w-12 text-jasper mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300" />
              <h3 className="text-xl font-bold text-jet mb-3">avg confidence</h3>
              <p className="text-jet/70 font-mono">
                {Math.round((predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length) * 100)}%
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
