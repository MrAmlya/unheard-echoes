'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Writing } from '@/types'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCalendar, FiTag, FiUser, FiHeart, FiMessageCircle, FiShare2, FiTwitter, FiFacebook, FiLinkedin, FiCopy } from 'react-icons/fi'
import { useSession } from 'next-auth/react'

export default function WritingPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [writing, setWriting] = useState<Writing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasLiked, setHasLiked] = useState(false)
  const [showShareOptions, setShowShareOptions] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchWriting(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    if (writing && !session) {
      const likedWritings = JSON.parse(localStorage.getItem('likedWritings') || '[]')
      setHasLiked(likedWritings.includes(writing.id))
    }
  }, [writing, session])

  const fetchWriting = async (id: string) => {
    try {
      const response = await fetch(`/api/writings/${id}`)
      if (response.ok) {
        const data = await response.json()
        setWriting(data)
      } else {
        setError('Writing not found')
      }
    } catch (err) {
      setError('Failed to load writing')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Social sharing functions
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/writing/${writing?.id}`
    }
    return ''
  }

  const getShareText = () => {
    if (!writing) return ''
    return `Check out this beautiful writing "${writing.title || 'Untitled'}" on Unheard Echoes! 🎭✨`
  }

  const shareToTwitter = () => {
    const url = getShareUrl()
    const text = getShareText()
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=UnheardEchoes,Writing,Poetry`)
  }

  const shareToFacebook = () => {
    const url = getShareUrl()
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
  }

  const shareToLinkedIn = () => {
    const url = getShareUrl()
    const text = getShareText()
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(writing?.title || 'Untitled')}&summary=${encodeURIComponent(text)}`)
  }

  const copyToClipboard = async () => {
    const url = getShareUrl()
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const handleLike = async () => {
    if (!writing) return

    // For anonymous users, prevent multiple likes using localStorage
    if (!session) {
      const likedWritings = JSON.parse(localStorage.getItem('likedWritings') || '[]')
      if (likedWritings.includes(writing.id)) {
        return // Already liked, don't allow multiple likes
      }
    }
    
    try {
      const response = await fetch(`/api/writings/${writing.id}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setWriting({ ...writing, likes: data.likes })
        setHasLiked(data.liked)
        
        // For anonymous users, track in localStorage
        if (!session) {
          const likedWritings = JSON.parse(localStorage.getItem('likedWritings') || '[]')
          if (data.liked && !likedWritings.includes(writing.id)) {
            likedWritings.push(writing.id)
            localStorage.setItem('likedWritings', JSON.stringify(likedWritings))
          }
        }
      }
    } catch (error) {
      console.error('Error liking writing:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading writing...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !writing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-red-400 mb-4">Writing Not Found</h1>
          <p className="text-gray-300 mb-6">The writing you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => router.push('/')}
            className="glass-button px-6 py-3 rounded-xl font-medium flex items-center gap-2 mx-auto"
          >
            <FiArrowLeft />
            Back to Home
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/')}
          className="glass-button flex items-center gap-2 px-4 py-2 rounded-xl font-medium mb-8 hover:scale-105 transition-all"
        >
          <FiArrowLeft />
          Back to Home
        </motion.button>

        {/* Writing Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12">
            {/* Meta Information */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(writing.category)}`}>
                <FiTag className="inline mr-2" />
                {writing.category}
              </span>
              <span className="px-4 py-2 rounded-full text-sm glass flex items-center text-gray-300">
                <FiCalendar className="mr-2" />
                {formatDate(writing.date)}
              </span>
            </motion.div>

            {/* Title */}
            {writing.title && (
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent"
              >
                {writing.title}
              </motion.h1>
            )}

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <p className={`text-lg md:text-xl leading-relaxed text-gray-100 whitespace-pre-wrap ${
                writing.category === 'shayari' ? 'shayari-text text-center text-2xl' : ''
              }`}>
                {writing.content}
              </p>
            </motion.div>

            {/* Author */}
            {writing.author && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-6 border-t border-white/20 mb-8"
              >
                <div className="flex items-center gap-2 text-gray-300">
                  <FiUser className="text-purple-400" />
                  <span className="text-lg italic">— {writing.author}</span>
                </div>
              </motion.div>
            )}

            {/* Like Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-6 border-t border-white/20 mb-8"
            >
              <button
                onClick={handleLike}
                className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${
                  hasLiked
                    ? 'glass-button bg-red-500/20 hover:bg-red-500/30'
                    : 'glass-button hover:scale-105'
                }`}
              >
                <FiHeart className={hasLiked ? 'fill-red-500 text-red-500' : 'text-red-400'} />
                <span className="font-medium">
                  {writing.likes || 0} {writing.likes === 1 ? 'Like' : 'Likes'}
                </span>
              </button>
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-6 border-t border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-200">Share this writing</h3>
                <button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="glass-button flex items-center gap-2 px-4 py-2 rounded-full hover:scale-105 transition-all"
                >
                  <FiShare2 className="text-blue-400" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
              
              {showShareOptions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  <button
                    onClick={shareToTwitter}
                    className="glass-button flex items-center justify-center gap-2 px-4 py-3 rounded-full hover:scale-105 transition-all bg-blue-500/20 hover:bg-blue-500/30"
                  >
                    <FiTwitter className="text-blue-400" />
                    <span className="text-sm">Twitter</span>
                  </button>
                  
                  <button
                    onClick={shareToFacebook}
                    className="glass-button flex items-center justify-center gap-2 px-4 py-3 rounded-full hover:scale-105 transition-all bg-blue-600/20 hover:bg-blue-600/30"
                  >
                    <FiFacebook className="text-blue-500" />
                    <span className="text-sm">Facebook</span>
                  </button>
                  
                  <button
                    onClick={shareToLinkedIn}
                    className="glass-button flex items-center justify-center gap-2 px-4 py-3 rounded-full hover:scale-105 transition-all bg-blue-700/20 hover:bg-blue-700/30"
                  >
                    <FiLinkedin className="text-blue-600" />
                    <span className="text-sm">LinkedIn</span>
                  </button>
                  
                  <button
                    onClick={copyToClipboard}
                    className="glass-button flex items-center justify-center gap-2 px-4 py-3 rounded-full hover:scale-105 transition-all bg-gray-500/20 hover:bg-gray-500/30"
                  >
                    <FiCopy className="text-gray-400" />
                    <span className="text-sm">Copy Link</span>
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'shayari':
      return 'bg-pink-500/30 text-pink-300'
    case 'writing':
      return 'bg-purple-500/30 text-purple-300'
    case 'feeling':
      return 'bg-blue-500/30 text-blue-300'
    default:
      return 'bg-gray-500/30 text-gray-300'
  }
}
