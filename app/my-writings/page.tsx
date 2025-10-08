'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Writing } from '@/types'
import { motion } from 'framer-motion'
import { FiCalendar, FiTag, FiUser, FiEdit, FiTrash2, FiEye, FiHeart, FiMessageCircle, FiClock, FiCheck, FiX } from 'react-icons/fi'
import Link from 'next/link'

export default function MyWritingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [writings, setWritings] = useState<Writing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/login')
      return
    }
    
    fetchMyWritings()
  }, [session, status, router])

  const fetchMyWritings = async () => {
    try {
      const response = await fetch('/api/writings/my-writings')
      if (response.status === 401) {
        router.push('/login')
        return
      }
      if (response.ok) {
        const data = await response.json()
        setWritings(data)
      } else {
        setError('Failed to fetch your writings')
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
      case 'pending':
        return 'bg-yellow-500/30 text-yellow-300 border-yellow-500/50'
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
      case 'pending':
        return <FiClock className="text-yellow-400" />
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this writing? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/writings/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setWritings(writings.filter(w => w.id !== id))
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete writing')
      }
    } catch (error) {
      console.error('Error deleting writing:', error)
      alert('An error occurred while deleting the writing')
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your writings...</p>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
            My Writings
          </h1>
          <p className="text-gray-300 text-lg">
            Manage and view all your submitted writings
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
              onClick={() => setFilter('pending')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                filter === 'pending'
                  ? 'glass-button bg-yellow-500/20'
                  : 'glass-button hover:scale-105'
              }`}
            >
              <FiClock className="text-yellow-400" />
              Pending ({writings.filter(w => w.status === 'pending').length})
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
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No Writings Found</h3>
              <p className="text-gray-400 mb-6">
                {filter === 'all' 
                  ? "You haven't written anything yet. Start sharing your thoughts!"
                  : `No ${filter} writings found.`
                }
              </p>
              {filter === 'all' && (
                <Link
                  href="/admin"
                  className="glass-button px-6 py-3 rounded-xl font-medium inline-flex items-center gap-2 hover:scale-105 transition-all"
                >
                  <FiEdit />
                  Write Your First Post
                </Link>
              )}
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
                      {writing.content.length > 300 
                        ? writing.content.substring(0, 300) + '...' 
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

                  {/* Actions */}
                  <div className="lg:w-80">
                    <div className="glass rounded-xl p-4">
                      <h4 className="font-semibold text-gray-200 mb-3 flex items-center gap-2">
                        <FiEye className="text-blue-400" />
                        Actions
                      </h4>
                      
                      <div className="space-y-3">
                        <Link
                          href={`/writing/${writing.id}`}
                          className="w-full glass-button px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:scale-105 transition-all"
                        >
                          <FiEye />
                          View Post
                        </Link>
                        
                        <Link
                          href={`/admin?edit=${writing.id}`}
                          className="w-full glass-button px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:scale-105 transition-all"
                        >
                          <FiEdit />
                          Edit Post
                        </Link>
                        
                        <button
                          onClick={() => handleDelete(writing.id)}
                          className="w-full glass-button px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:scale-105 transition-all text-red-400 hover:text-red-300"
                        >
                          <FiTrash2 />
                          Delete Post
                        </button>
                      </div>

                      {/* Status Info */}
                      {writing.status === 'pending' && (
                        <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                          <p className="text-yellow-300 text-sm">
                            <FiClock className="inline mr-1" />
                            Your writing is pending admin review
                          </p>
                        </div>
                      )}
                      
                      {writing.status === 'rejected' && (
                        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <p className="text-red-300 text-sm">
                            <FiX className="inline mr-1" />
                            Your writing was not approved
                          </p>
                        </div>
                      )}
                      
                      {writing.status === 'approved' && (
                        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <p className="text-green-300 text-sm">
                            <FiCheck className="inline mr-1" />
                            Your writing is live and visible to everyone
                          </p>
                        </div>
                      )}
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
