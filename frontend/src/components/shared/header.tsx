import type React from "react"
import { ArrowLeft, } from "lucide-react"
import { RacingStripe } from "./racing-stripe"
import Link from "next/link"

interface HeaderProps {
    title: string
    subtitle: string
    icon?: React.ReactNode
    backLink?: string
    backText?: string
    currentPage?: string
}

export function Header({
  title,
  subtitle,
  backLink,
  backText,
  currentPage = "home",
}: HeaderProps) {
  return (
    <header className="bg-jet shadow-lg relative overflow-hidden">
      <RacingStripe />
      <div className="container mx-auto px-6 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 animate-slide-in-left">
            {backLink && (
              <Link
                href={backLink}
                className="flex items-center space-x-2 text-silver hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="text-sm">{backText || "back"}</span>
              </Link>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              <p className="text-sm text-caramel">{subtitle}</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8 animate-slide-in-right">
            <Link
              href="/"
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                currentPage === "home" ? "text-white" : "text-silver hover:text-white"
              }`}
            >
              home
            </Link>
            <Link
              href="/drivers"
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                currentPage === "drivers" ? "text-white" : "text-silver hover:text-white"
              }`}
            >
              drivers
            </Link>
            <Link
              href="/stats/coming-soon"
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                currentPage === "stats" ? "text-white" : "text-silver hover:text-white"
              }`}
            >
            <span>stats</span>
            </Link>
                        <Link
              href="/predictions"
              className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                currentPage === "stats" ? "text-white" : "text-silver hover:text-white"
              }`}
            >
              predictions
            </Link>
          
          
          </nav>
        </div>
      </div>
    </header>    
  )
}