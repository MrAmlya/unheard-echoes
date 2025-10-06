'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiX, FiLoader, FiAlertCircle } from 'react-icons/fi'
import { Writing } from '@/types'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ReviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [pendingWritings, setPendingWritings] = useState<Writing[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Redirect if not admin
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated' && session?.user.role !== 'admin') {
      router.push('/admin')
    }
  }, [status, session, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user.role === 'admin') {
      fetchPendingWritings()
    }
  }, [status, session])

  const fetchPendingWritings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/writings/pending')
      if (response.status === 401 || response.status === 403) {
        router.push('/login')
        return
      }
      const data = await response.json()
      setPendingWritings(data)
    } catch (error) {
      console.error('Error fetching pending writings:', error)
      setMessage({ type: 'error', text: 'Failed to fetch pending writings' })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    setProcessingId(id)
    try {
      const response = await fetch(`/api/writings/${id}/approve`, {
        method: 'POST',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Writing approved successfully!' })
        fetchPendingWritings()
        setTimeout(() => setMessage(null), 3000)
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Failed to approve' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to approve writing' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    if (!confirm('Are you sure you want to reject this writing?')) return
    
    setProcessingId(id)
    try {
      const response = await fetch(`/api/writings/${id}/reject`, {
        method: 'POST',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Writing rejected' })
        fetchPendingWritings()
        setTimeout(() => setMessage(null), 3000)
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Failed to reject' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reject writing' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setProcessingId(null)
    }
  }

  // Show loading while checking authentication
  if (status === 'loading' || status === 'unauthenticated' || (session && session.user.role !== 'admin')) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-5xl text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
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

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Review Submissions
        </h1>
        <p className="text-gray-300">Approve or reject pending writings</p>
      </motion.div>

      {/* Success/Error Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card rounded-xl p-4 mb-6 ${
            message.type === 'success' ? 'border-green-500/50' : 'border-red-500/50'
          }`}
        >
          <p className={message.type === 'success' ? 'text-green-300' : 'text-red-300'}>
            {message.text}
          </p>
        </motion.div>
      )}

      {/* Pending Writings List */}
      <div className="mb-12">
        {loading ? (
          <div className="text-center py-12 glass-card rounded-xl">
            <FiLoader className="text-4xl text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading pending writings...</p>
          </div>
        ) : pendingWritings.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-xl">
            <FiAlertCircle className="text-5xl text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-300 mb-2">No pending writings</p>
            <p className="text-gray-400">All submissions have been reviewed!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingWritings.map((writing, index) => (
              <motion.div
                key={writing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-2xl p-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getCategoryColor(writing.category)}`}>
                    {writing.category}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {new Date(writing.date).toLocaleDateString()}
                  </span>
                </div>

                {/* Title */}
                {writing.title && (
                  <h3 className="text-2xl font-bold mb-3 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
                    {writing.title}
                  </h3>
                )}

                {/* Content */}
                <div className="mb-4">
                  <p className={`text-gray-200 whitespace-pre-wrap ${
                    writing.category === 'shayari' ? 'shayari-text text-center' : ''
                  }`}>
                    {writing.content}
                  </p>
                </div>

                {/* Author */}
                {writing.author && (
                  <div className="mb-4 pt-4 border-t border-white/10">
                    <p className="text-gray-400 text-sm italic">— {writing.author}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => handleApprove(writing.id)}
                    disabled={processingId === writing.id}
                    className="flex-1 glass-button px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingId === writing.id ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <>
                        <FiCheck />
                        <span>Approve</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(writing.id)}
                    disabled={processingId === writing.id}
                    className="flex-1 glass px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-red-500/30 transition-all text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingId === writing.id ? (
                      <FiLoader className="animate-spin" />
                    ) : (
                      <>
                        <FiX />
                        <span>Reject</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

