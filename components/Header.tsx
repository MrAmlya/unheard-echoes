'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FiMenu, FiX, FiHeart, FiEdit, FiHome, FiLogOut, FiLogIn, FiUser, FiClock } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <FiHeart className="text-3xl text-pink-400 heart-beat" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Unheard Echoes
          </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-white/10 transition-all"
            >
              <FiHome />
              <span>Home</span>
            </Link>
            
            {status === 'authenticated' ? (
              <>
                <Link 
                  href="/admin" 
                  className="flex items-center space-x-2 px-6 py-2 rounded-full glass-button"
                >
                  <FiEdit />
                  <span>Add Writing</span>
                </Link>
                {session.user.role === 'admin' && (
                  <>
                    <Link 
                      href="/admin/review" 
                      className="flex items-center space-x-2 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 hover:from-purple-500/40 hover:to-pink-500/40 transition-all"
                    >
                      <FiUser />
                      <span>Review</span>
                    </Link>
                    <Link 
                      href="/admin/history" 
                      className="flex items-center space-x-2 px-6 py-2 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-400/50 hover:from-blue-500/40 hover:to-cyan-500/40 transition-all"
                    >
                      <FiClock />
                      <span>History</span>
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-3 px-4 py-2 rounded-full glass">
                  <FiUser className="text-purple-400" />
                  <span className="text-sm">{session.user.name}</span>
                  {session.user.role === 'admin' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/30 text-purple-300">Admin</span>
                  )}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-red-500/20 transition-all text-red-300"
                >
                  <FiLogOut />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center space-x-2 px-6 py-2 rounded-full glass-button"
              >
                <FiLogIn />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-all"
          >
            {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-3"
            >
              <Link 
                href="/" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-white/10 transition-all"
              >
                <FiHome />
                <span>Home</span>
              </Link>
              
              {status === 'authenticated' ? (
                <>
                  <Link 
                    href="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-3 rounded-lg glass-button"
                  >
                    <FiEdit />
                    <span>Add Writing</span>
                  </Link>
                  {session.user.role === 'admin' && (
                    <>
                      <Link 
                        href="/admin/review" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50"
                      >
                        <FiUser />
                        <span>Review Submissions</span>
                      </Link>
                      <Link 
                        href="/admin/history" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-400/50"
                      >
                        <FiClock />
                        <span>Review History</span>
                      </Link>
                    </>
                  )}
                  <div className="flex flex-col px-4 py-3 rounded-lg glass">
                    <div className="flex items-center space-x-2">
                      <FiUser className="text-purple-400" />
                      <span>{session.user.name}</span>
                    </div>
                    {session.user.role === 'admin' && (
                      <span className="text-xs mt-1 px-2 py-1 rounded-full bg-purple-500/30 text-purple-300 self-start">Admin</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleSignOut()
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-all text-red-300"
                  >
                    <FiLogOut />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3 rounded-lg glass-button"
                >
                  <FiLogIn />
                  <span>Sign In</span>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

