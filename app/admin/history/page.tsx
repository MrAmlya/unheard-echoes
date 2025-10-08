'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Writing } from '@/types'
import { motion } from 'framer-motion'
import { FiCalendar, FiTag, FiUser, FiCheck, FiX, FiClock, FiEye, FiHeart, FiMessageCircle } from 'react-icons/fi'

export default function AdminHistoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [writings, setWritings] = useState<Writing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session || session.user?.role !== 'admin') {
      router.push('/login')
      return
    }
    
    fetchReviewedWritings()
  }, [session, status, router])

  const fetchReviewedWritings = async () => {
    try {
      const response = await fetch('/api/writings/reviewed')
      if (response.ok) {
        const data = await response.json()
        setWritings(data)
      } else {
        setError('Failed to fetch reviewed writings')
      }
    } catch (err) {
      setError('An error occurred while fetching data')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/30 text-green-300 border-green-500/50'
      case 'rejected':
        return 'bg-red-500/30 text-red-300 border-red-500/50'
      default:
        return 'bg-gray-500/30 text-gray-300 border-gray-500/50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return null
      case 'rejected':
        return <FiX className="text-red-400" />
      default:
        return <FiClock className="text-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredWritings = writings.filter(writing => {
    if (filter === 'all') return true
    return writing.status === filter
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading review history...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="glass-button px-6 py-3 rounded-xl font-medium"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
            Review History
          </h1>
          <p className="text-gray-300 text-lg">
            Track all approved and rejected writings with their review details
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                filter === 'all'
                  ? 'glass-button bg-purple-500/20'
                  : 'glass-button hover:scale-105'
              }`}
            >
              All ({writings.length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                filter === 'approved'
                  ? 'glass-button bg-green-500/20'
                  : 'glass-button hover:scale-105'
              }`}
            >
              <FiCheck className="text-green-400" />
              Approved ({writings.filter(w => w.status === 'approved').length})
            </button>
            <button
              onClick={() => setFilter('rejected')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                filter === 'rejected'
                  ? 'glass-button bg-red-500/20'
                  : 'glass-button hover:scale-105'
              }`}
            >
              <FiX className="text-red-400" />
              Rejected ({writings.filter(w => w.status === 'rejected').length})
            </button>
          </div>
        </motion.div>

        {/* Writings List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {filteredWritings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No Reviewed Writings</h3>
              <p className="text-gray-400">
                {filter === 'all' 
                  ? "No writings have been reviewed yet."
                  : `No ${filter} writings found.`
                }
              </p>
            </div>
          ) : (
            filteredWritings.map((writing, index) => (
              <motion.div
                key={writing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Main Content */}
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(writing.category)}`}>
                        <FiTag className="inline mr-1" />
                        {writing.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(writing.status)}`}>
                        {getStatusIcon(writing.status) && (
                          <>
                            {getStatusIcon(writing.status)}
                            <span className="ml-1 capitalize">{writing.status}</span>
                          </>
                        )}
                        {!getStatusIcon(writing.status) && (
                          <span className="capitalize">{writing.status}</span>
                        )}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center">
                        <FiCalendar className="mr-1" />
                        {formatDate(writing.date)}
                      </span>
                    </div>

                    {/* Title */}
                    {writing.title && (
                      <h3 className="text-2xl font-bold mb-3 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
                        {writing.title}
                      </h3>
                    )}

                    {/* Content Preview */}
                    <p className="text-gray-200 mb-4 line-clamp-3">
                      {writing.content.length > 200 
                        ? writing.content.substring(0, 200) + '...' 
                        : writing.content}
                    </p>

                    {/* Author */}
                    {writing.author && (
                      <div className="flex items-center gap-2 text-gray-300 mb-4">
                        <FiUser className="text-purple-400" />
                        <span className="italic">— {writing.author}</span>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiHeart className="text-red-400" />
                        {writing.likes || 0} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <FiMessageCircle className="text-purple-400" />
                        {writing.comments?.length || 0} comments
                      </span>
                    </div>
                  </div>

                  {/* Review Details */}
                  <div className="lg:w-80">
                    <div className="glass rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                        <FiEye className="text-blue-400" />
                        Review Details
                      </h4>
                      
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-gray-400">Status:</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(writing.status)}`}>
                            {getStatusIcon(writing.status) && (
                              <>
                                {getStatusIcon(writing.status)}
                                <span className="ml-1 capitalize">{writing.status}</span>
                              </>
                            )}
                            {!getStatusIcon(writing.status) && (
                              <span className="capitalize">{writing.status}</span>
                            )}
                          </span>
                        </div>
                        
                        {writing.reviewedAt && (
                          <div>
                            <span className="text-gray-400">Reviewed:</span>
                            <span className="ml-2 text-gray-200">
                              {formatDate(writing.reviewedAt)}
                            </span>
                          </div>
                        )}
                        
                        {writing.reviewedBy && (
                          <div>
                            <span className="text-gray-400">Reviewed by:</span>
                            <span className="ml-2 text-gray-200">
                              {writing.reviewedBy === session?.user?.id ? 'You' : 'Admin'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
