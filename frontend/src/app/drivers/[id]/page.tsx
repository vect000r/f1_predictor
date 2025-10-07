import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { SpeedLines } from "@/components/shared/speed-lines"
import { User, Flag, Calendar, Trophy, Users, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getDriverData, getLatestDriverStanding } from "@/lib/api"

export default async function DriverDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const driverNumber = await resolvedParams.id; 
  const driver = await getDriverData(Number(driverNumber))
  const standing = await getLatestDriverStanding(Number(driverNumber))

  if (!driver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-silver via-white to-silver font-mono flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-jet mb-4">driver not found</h1>
          <Link href="/drivers" className="text-pennred hover:text-jasper transition-colors">
            ← back to drivers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver via-white to-silver font-mono">
      {/* Header */}
      <Header
        title={`#${driver.driver_number}`}
        subtitle={driver.name_acronym}
        icon={<User className="h-5 w-5 text-white" />}
        backLink="/drivers"
        backText="drivers"
        currentPage="drivers"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Driver Hero Section */}
        <div className="max-w-6xl mx-auto">
          <Card className="bg-gradient-to-r from-white to-silver/30 border border-jet/20 shadow-2xl mb-12 overflow-hidden group">
            <SpeedLines />
            <CardContent className="p-12 relative z-10">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="animate-slide-in-left">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-jet rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      {driver.driver_number}
                    </div>
                    <Badge variant="outline" className="border-pennred text-pennred font-mono text-lg px-4 py-2">
                      {driver.name_acronym}
                    </Badge>
                  </div>

                  <h1 className="text-5xl font-bold text-jet mb-2 group-hover:text-pennred transition-colors duration-300">
                    {driver.first_name}
                  </h1>
                  <h2 className="text-3xl font-semibold text-jet/70 mb-6 uppercase tracking-wide">
                    {driver.last_name}
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg text-caramel font-medium">{driver.team_name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg text-jet/70">{driver.country_code}</span>
                    </div>
                  </div>
                </div>

                <div className="animate-slide-in-right">
                  <div className="w-64 h-64 mx-auto relative">
                    <Image
                      src={driver.headshot_url || "/placeholder.svg"}
                      alt={driver.full_name}
                      
                      fill
                      className="rounded-full object-cover shadow-2xl ring-8 ring-white group-hover:ring-pennred transition-all duration-500 scale-300"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Driver Details Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Basic Info Card */}
            <Card className="bg-gradient-to-br from-white to-silver/30 border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-jet">
                  <User className="h-6 w-6 text-pennred" />
                  <span>driver info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-jet/60 uppercase tracking-wide">full name</p>
                  <p className="text-lg font-semibold text-jet">{driver.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-jet/60 uppercase tracking-wide">broadcast name</p>
                  <p className="text-lg font-semibold text-jet font-mono">{driver.broadcast_name}</p>
                </div>
              </CardContent>
            </Card>

            {/* Team Info Card */}
            <Card className="bg-gradient-to-br from-white to-silver/30 border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-jet">
                  <Users className="h-6 w-6 text-caramel" />
                  <span>team info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-jet/60 uppercase tracking-wide">team</p>
                  <p className="text-lg font-semibold text-caramel">{driver.team_name}</p>
                </div>
                <div>
                  <p className="text-sm text-jet/60 uppercase tracking-wide">car number</p>
                  <p className="text-lg font-semibold text-jet">#{driver.driver_number}</p>
                </div>
              </CardContent>
            </Card>

            {/* Session Info Card */}
            <Card className="bg-gradient-to-br from-white to-silver/30 border border-jet/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-jet">
                  <Calendar className="h-6 w-6 text-jasper" />
                  <span>WDC standing</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-jet/60 uppercase tracking-wide">position</p>
                  <p className="text-lg font-semibold text-jet font-mono">{standing?.position}</p>
                </div>
                <div>
                  <p className="text-sm text-jet/60 uppercase tracking-wide">points</p>
                  <p className="text-lg font-semibold text-jet font-mono">{standing?.points}</p>
                </div>
                <div>
                  <p className="text-sm text-jet/60 uppercase tracking-wide">wins</p>
                  <p className="text-lg font-semibold text-jet font-mono">{standing?.wins}</p>
                </div>
              
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-12 flex justify-center space-x-6 animate-fade-in-up">
            <Link
              href="/drivers"
              className="flex items-center space-x-2 bg-jet text-white px-6 py-3 rounded-lg hover:bg-pennred transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>back to drivers</span>
            </Link>
            <Link
              href="/stats"
              className="flex items-center space-x-2 bg-caramel text-white px-6 py-3 rounded-lg hover:bg-jasper transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Trophy className="h-5 w-5" />
              <span>view stats</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
