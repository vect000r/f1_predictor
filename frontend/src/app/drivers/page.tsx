import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { Users, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getAllDrivers } from "@/lib/api"

export const dynamic = 'force-dynamic'

export default async function DriversPage() {
  const drivers = await getAllDrivers()
  const sortedDrivers = drivers.sort((a, b) => a.driver_number - b.driver_number)

  return (
    <div className="min-h-screen bg-gradient-to-br from-silver via-white to-silver font-mono">
      {/* Header */}
      <Header
        title="drivers"
        subtitle="f1 2025 grid"
        icon={<Users className="h-5 w-5 text-white" />}
        backLink="/"
        backText="back"
        currentPage="drivers"
      />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 animate-fade-in-up">
          <h2 className="text-5xl font-bold text-jet mb-4">2025 grid</h2>
          <p className="text-xl text-jet/70 max-w-2xl">meet the drivers competing in the current formula 1 season</p>
        </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {sortedDrivers.map((driver, index) => {
            const animationDelay = `${index * 0.1}s`

            return (
              <Link key={driver.id} href={`/drivers/${driver.driver_number}`}>
                <Card
                  className="bg-gradient-to-br from-white to-silver/30 border border-jet/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden cursor-pointer"
                  style={{ animationDelay }}
                >
                  
                  <CardContent className="p-6 animate-fade-in-up relative z-10">
                    <div className="text-center">
                      {/* Driver Number */}
                      <div className="absolute top-4 right-4 w-12 h-12 bg-jet rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:rotate-12 transition-transform duration-300">
                        {driver.driver_number}
                      </div>

                      {/* Driver Photo */}
                      <div className="w-24 h-24 mx-auto mb-4 relative">
                        <Image
                          src={`/drivers/${driver.driver_number}.png` || "/placeholder.svg"}
                          alt={driver.full_name}
                          fill
                          className="rounded-full object-cover shadow-lg ring-4 ring-white group-hover:ring-pennred transition-all duration-300"
                          crossOrigin="anonymous"
                        />
                      </div>

                      {/* Driver Name */}
                      <h3 className="text-xl font-bold text-jet mb-2 group-hover:text-pennred transition-colors duration-300">
                        {driver.first_name}
                      </h3>
                      <h4 className="text-lg font-semibold text-jet/70 mb-3 uppercase tracking-wide">
                        {driver.last_name}
                      </h4>

                      {/* Driver Details */}
                      <div className="space-y-2">
                        <Badge variant="outline" className="border-jet/30 text-jet font-mono bg-white/50">
                          {driver.name_acronym}
                        </Badge>
                        <p className="text-sm text-caramel font-medium">{driver.team_name}</p>
                        <p className="text-xs text-jet/50 uppercase tracking-wider">{driver.country_code}</p>
                      </div>

                      {/* Hover Effect Indicator */}
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center justify-center space-x-2 text-pennred text-sm">
                          <Zap className="h-4 w-4" />
                          <span>view details</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Stats Summary */}
        <div className="mt-16 text-center animate-fade-in-up">
          <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg border border-jet/10">
            <Users className="h-6 w-6 text-pennred" />
            <span className="text-jet font-mono">
              <span className="font-bold text-2xl">{sortedDrivers.length}</span> drivers competing
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
