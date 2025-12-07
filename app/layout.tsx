import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import React from 'react'
import { Inter, Outfit } from 'next/font/google'
import '../styles/globals.css'
import { Toaster } from '../components/ui/Toaster'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

// Root layout for the App Router. Wraps pages with Navbar and Footer.
export const metadata = {
  title: 'Neuro',
  description: 'Turn screen time into brain time',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans antialiased text-slate-200 bg-transparent flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {children}
        </main>
        <Footer />
        <Toaster />
        <div id="toast-container" className="fixed bottom-4 right-4 z-50"></div>
      </body>
    </html>
  )
}
