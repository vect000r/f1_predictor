import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/shared/header"
import { Footer } from "@/components/shared/footer"
import { SpeedLines } from "@/components/shared/speed-lines"
import { Gauge } from "lucide-react"

interface ComingSoonPageProps {
  section?: string
  title?: string
  description?: string
  currentPage?: string
}

export default function ComingSoonPage({
  section = "feature",
  title = "coming soon",
  description = "this section is currently under development",
  currentPage = "home",
}: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-silver via-white to-silver font-mono">
      {/* Header */}
      <Header title="f1-predictor" subtitle="race analytics" currentPage={currentPage} />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-16 animate-fade-in-up">
          <h2 className="text-5xl font-bold text-jet mb-4">{section}</h2>
          <p className="text-xl text-jet/70 max-w-2xl">formula 1 race analytics</p>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="border border-jet/20 shadow-2xl bg-gradient-to-r from-white via-silver/20 to-white relative overflow-hidden group">
            <SpeedLines />
            <CardContent className="p-16 text-center relative z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pennred/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-1000"></div>

              <Badge
                variant="outline"
                className="border-pennred text-pennred font-mono bg-white/50 px-4 py-2 text-sm mb-8"
              >
                {title}
              </Badge>

              <Gauge className="h-16 w-16 text-jet/40 mx-auto mb-8 group-hover:rotate-12 transition-transform duration-300" />

              <p className="text-lg text-jet/70 font-mono leading-relaxed">{description}</p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}