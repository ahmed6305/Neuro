import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import React from 'react'
import { Inter, Outfit } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

// Root layout for the App Router. Wraps pages with Navbar and Footer.
export const metadata = {
  title: 'Neuro',
  description: 'Turn screen time into brain time',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-slate-200 bg-slate-900`}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
