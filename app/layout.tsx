import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SessionProvider from '@/components/SessionProvider'

export const metadata: Metadata = {
  title: 'Unheard Echoes | Express Your Heart',
  description: 'A beautiful platform to share poetry, writings, and heartfelt expressions that resonate with the soul',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="min-h-screen relative">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
              <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>
            
            <div className="relative z-10">
            <Header />
            <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-400px)]">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </SessionProvider>
    </body>
  </html>
  )
}

