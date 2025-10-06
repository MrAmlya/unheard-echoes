'use client'

import { Writing, Comment } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiCalendar, FiTag, FiUser, FiHeart, FiMessageCircle, FiTrash2 } from 'react-icons/fi'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface WritingModalProps {
  writing: Writing | null
  isOpen: boolean
  onClose: () => void
  onUpdate?: () => void
}

export default function WritingModal({ writing, isOpen, onClose, onUpdate }: WritingModalProps) {
  const { data: session } = useSession()
  const [localWriting, setLocalWriting] = useState<Writing | null>(writing)
  const [commentName, setCommentName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasLiked, setHasLiked] = useState(false)

  useEffect(() => {
    setLocalWriting(writing)
  }, [writing])

  if (!localWriting) return null

  const handleLike = async () => {
    if (hasLiked) return // Prevent multiple likes
    
    try {
      const response = await fetch(`/api/writings/${localWriting.id}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setLocalWriting({ ...localWriting, likes: data.likes })
        setHasLiked(true)
        if (onUpdate) onUpdate()
      }
    } catch (error) {
      console.error('Error liking writing:', error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentName.trim() || !commentText.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/writings/${localWriting.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: commentName,
          text: commentText,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setLocalWriting({
          ...localWriting,
          comments: [...(localWriting.comments || []), data.comment],
        })
        setCommentName('')
        setCommentText('')
        if (onUpdate) onUpdate()
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      const response = await fetch(`/api/writings/${localWriting.id}/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setLocalWriting({
          ...localWriting,
          comments: localWriting.comments?.filter((c) => c.id !== commentId) || [],
        })
        if (onUpdate) onUpdate()
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'shayari':
        return 'bg-pink-500/30 text-pink-300 border-pink-500/50'
      case 'writing':
        return 'bg-purple-500/30 text-purple-300 border-purple-500/50'
      case 'feeling':
        return 'bg-blue-500/30 text-blue-300 border-blue-500/50'
      default:
        return 'bg-gray-500/30 text-gray-300 border-gray-500/50'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="glass-card rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden pointer-events-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full glass-button hover:bg-red-500/30 transition-all z-10"
                aria-label="Close"
              >
                <FiX className="text-xl" />
              </button>

              {/* Content */}
              <div className="overflow-y-auto max-h-[85vh] p-8 md:p-12">
                {/* Header */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getCategoryColor(localWriting.category)}`}>
                    <FiTag className="inline mr-2" />
                    {localWriting.category}
                  </span>
                  <span className="px-4 py-2 rounded-full text-sm glass flex items-center text-gray-300">
                    <FiCalendar className="mr-2" />
                    {formatDate(localWriting.date)}
                  </span>
                </div>

                {/* Title */}
                {localWriting.title && (
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent"
                  >
                    {localWriting.title}
                  </motion.h2>
                )}

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <p className={`text-lg md:text-xl leading-relaxed text-gray-100 whitespace-pre-wrap ${
                    localWriting.category === 'shayari' ? 'shayari-text text-center text-2xl' : ''
                  }`}>
                    {localWriting.content}
                  </p>
                </motion.div>

                {/* Author */}
                {localWriting.author && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-6 border-t border-white/20"
                  >
                    <div className="flex items-center gap-2 text-gray-300">
                      <FiUser className="text-purple-400" />
                      <span className="text-lg italic">— {localWriting.author}</span>
                    </div>
                  </motion.div>
                )}

                {/* Like Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-6 border-t border-white/20"
                >
                  <button
                    onClick={handleLike}
                    disabled={hasLiked}
                    className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${
                      hasLiked
                        ? 'glass cursor-not-allowed opacity-60'
                        : 'glass-button hover:scale-105'
                    }`}
                  >
                    <FiHeart className={hasLiked ? 'fill-red-500 text-red-500' : 'text-red-400'} />
                    <span className="font-medium">
                      {localWriting.likes || 0} {localWriting.likes === 1 ? 'Like' : 'Likes'}
                    </span>
                  </button>
                </motion.div>

                {/* Comments Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-6 border-t border-white/20"
                >
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-300">
                    <FiMessageCircle />
                    Comments ({localWriting.comments?.length || 0})
                  </h3>

                  {/* Comment Form */}
                  <form onSubmit={handleCommentSubmit} className="mb-6 glass-card rounded-xl p-6">
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        maxLength={50}
                        required
                        className="w-full px-4 py-3 rounded-xl glass focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                      />
                      <textarea
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        maxLength={500}
                        required
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl glass focus:ring-2 focus:ring-purple-400 outline-none transition-all resize-none"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="glass-button px-6 py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-4">
                    {localWriting.comments && localWriting.comments.length > 0 ? (
                      localWriting.comments.map((comment) => (
                        <motion.div
                          key={comment.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="glass-card rounded-xl p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-purple-300">{comment.name}</p>
                              <p className="text-sm text-gray-400">{formatCommentDate(comment.date)}</p>
                            </div>
                            {session?.user.role === 'admin' && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="p-2 rounded-lg hover:bg-red-500/30 transition-all text-red-400"
                                title="Delete comment (Admin)"
                              >
                                <FiTrash2 />
                              </button>
                            )}
                          </div>
                          <p className="text-gray-200">{comment.text}</p>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400 py-8">
                        No comments yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Decorative Element */}
                <div className="mt-8 flex justify-center">
                  <div className="h-1 w-32 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
                </div>
              </div>

              {/* Gradient Overlay at bottom for scroll indication */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

