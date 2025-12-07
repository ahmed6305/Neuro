"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Games', href: '/games' },
    { name: 'Profile', href: '/profile' },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled || showMenu ? 'bg-slate-900/90 backdrop-blur-md border-slate-700/50' : 'bg-transparent border-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 group">
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              Neuro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-white ${isActive(link.href) ? 'text-neon-blue' : 'text-slate-400'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link href="/profile" className="hidden md:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-all bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg hover:opacity-90 shadow-lg shadow-neon-blue/20">
              Get Started
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current transform transition-transform ${showMenu ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 bg-current transition-opacity ${showMenu ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-current transform transition-transform ${showMenu ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-700/50 bg-slate-900/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setShowMenu(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive(link.href)
                      ? 'bg-neon-blue/10 text-neon-blue'
                      : 'text-slate-300 hover:bg-slate-800'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-700/50">
                <Link
                  href="/profile"
                  onClick={() => setShowMenu(false)}
                  className="block w-full text-center px-4 py-3 text-base font-semibold text-white bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
