import { Zap, Users, Flag } from "lucide-react"

export function Footer() {
    return (
    <footer className="bg-jet mt-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-caramel via-pennred to-jasper"></div>
      <div className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">f1-predictor</h3>
            <p className="text-silver text-sm leading-relaxed">
              formula 1 race analysis, predictions, and statistics powered by openf1 api.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">navigation</h4>
            <ul className="space-y-3 text-sm text-silver">
              <li>
                <a href="/" className="hover:text-caramel transition-colors duration-300 flex items-center space-x-2">
                  <Zap className="h-3 w-3" />
                  <span>home</span>
                </a>
              </li>
              <li>
                <a href="/drivers" className="hover:text-caramel transition-colors duration-300 flex items-center space-x-2">
                  <Users className="h-3 w-3" />
                  <span>drivers</span>
                </a>
              </li>
              <li>
                <a href="/stats" className="hover:text-caramel transition-colors duration-300 flex items-center space-x-2">
                  <Flag className="h-3 w-3" />
                  <span>stats</span>
                </a>
              </li>
              <li>
                <a href="/predictions" className="hover:text-caramel transition-colors duration-300 flex items-center space-x-2">
                  <Flag className="h-3 w-3" />
                  <span>predictions</span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">data source</h4>
            <p className="text-silver text-sm leading-relaxed">
                f1 data provided by the openf1 api for accurate race statistics and driver information.
            </p>
          </div>
        </div>
        <div className="border-t border-caramel/30 mt-8 pt-8 text-center">
          <p className="text-silver/70 text-sm font-mono">© 2025 f1-predictor | powered by openf1</p>
        </div>
      </div>
    </footer>        
    )
}