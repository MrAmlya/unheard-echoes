'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { FiMenu, FiX, FiHeart, FiEdit, FiHome, FiLogOut, FiLogIn, FiUser, FiClock, FiBookOpen, FiChevronDown } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isScrolledUp, setIsScrolledUp] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { data: session, status } = useSession()
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle scroll behavior for mobile navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // On mobile, show navbar when scrolling up, hide when scrolling down
      if (window.innerWidth < 768) {
        if (currentScrollY < lastScrollY || currentScrollY < 100) {
          setIsScrolledUp(true)
        } else {
          setIsScrolledUp(false)
        }
      } else {
        // On desktop, always show navbar
        setIsScrolledUp(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    const handleResize = () => {
      // Reset scroll state on resize
      if (window.innerWidth >= 768) {
        setIsScrolledUp(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [lastScrollY])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header 
      className={`glass border-b border-white/20 z-50 w-full fixed top-0 transition-transform duration-300 ease-in-out ${
        isScrolledUp ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
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
                
                {/* User Menu Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 px-4 py-2 rounded-full glass hover:bg-white/10 transition-all"
                  >
                    <FiUser className="text-purple-400" />
                    <span className="text-sm">{session.user.name}</span>
                    {session.user.role === 'admin' && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-500/30 text-purple-300">Admin</span>
                    )}
                    <FiChevronDown className={`text-xs transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-lg z-50"
                      >
                        <div className="py-2">
                          <Link
                            href="/my-writings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all"
                          >
                            <FiBookOpen className="text-green-400" />
                            <span>My Writings</span>
                          </Link>
                          
                          {session.user.role === 'admin' && (
                            <>
                              <Link
                                href="/admin/review"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all"
                              >
                                <FiUser className="text-purple-400" />
                                <span>Review</span>
                              </Link>
                              <Link
                                href="/admin/history"
                                onClick={() => setIsUserMenuOpen(false)}
                                className="flex items-center space-x-3 px-4 py-3 hover:bg-white/10 transition-all"
                              >
                                <FiClock className="text-blue-400" />
                                <span>History</span>
                              </Link>
                            </>
                          )}
                          
                          <div className="border-t border-white/10 my-1"></div>
                          
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false)
                              handleSignOut()
                            }}
                            className="flex items-center space-x-3 px-4 py-3 hover:bg-red-500/20 transition-all text-red-300 w-full text-left"
                          >
                            <FiLogOut />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
                  {/* User Section */}
                  <div className="px-4 py-3 rounded-lg glass">
                    <div className="flex items-center space-x-2 mb-3">
                      <FiUser className="text-purple-400" />
                      <span className="font-medium">{session.user.name}</span>
                      {session.user.role === 'admin' && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/30 text-purple-300">Admin</span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Link
                        href="/my-writings"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
                      >
                        <FiBookOpen className="text-green-400" />
                        <span>My Writings</span>
                      </Link>
                      
                      {session.user.role === 'admin' && (
                        <>
                          <Link
                            href="/admin/review"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
                          >
                            <FiUser className="text-purple-400" />
                            <span>Review Submissions</span>
                          </Link>
                          <Link
                            href="/admin/history"
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all"
                          >
                            <FiClock className="text-blue-400" />
                            <span>Review History</span>
                          </Link>
                        </>
                      )}
                      
                      <div className="border-t border-white/10 my-2"></div>
                      
                      <button
                        onClick={() => {
                          setIsMenuOpen(false)
                          handleSignOut()
                        }}
                        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-all text-red-300 w-full text-left"
                      >
                        <FiLogOut />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
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

