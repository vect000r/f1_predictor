'use client'

import type React from "react"
import { ArrowLeft, Menu, X } from "lucide-react"
import { RacingStripe } from "./racing-stripe"
import Link from "next/link"
import { useState } from "react"

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "home", page: "home" },
    { href: "/drivers", label: "drivers", page: "drivers" },
    { href: "/stats", label: "stats", page: "stats" },
    { href: "/predictions", label: "predictions", page: "predictions" },
  ]

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="bg-jet shadow-lg relative overflow-hidden">
      <RacingStripe />
      <div className="container mx-auto px-4 sm:px-6 py-6 relative z-10">
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
              <h1 className="text-xl sm:text-2xl font-bold text-white">{title}</h1>
              <p className="text-xs sm:text-sm text-caramel">{subtitle}</p>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8 animate-slide-in-right">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  currentPage === link.page ? "text-white" : "text-silver hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-white hover:text-caramel transition-colors p-2"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobileMenu}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-jet shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">menu</h2>
            <button
              onClick={closeMobileMenu}
              className="text-silver hover:text-white transition-colors p-2"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                href={link.href}
                onClick={closeMobileMenu}
                className={`text-lg font-medium transition-colors py-2 px-4 rounded-md ${
                  currentPage === link.page
                    ? "text-white bg-pennred/20 border-l-4 border-pennred"
                    : "text-silver hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-silver/20">
          <p className="text-xs text-silver/50 text-center">f1-predictor © 2025</p>
        </div>
      </aside>
    </header>
  )
}