'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiTrash2, FiEdit, FiLoader } from 'react-icons/fi'
import { Writing } from '@/types'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'shayari' as 'shayari' | 'writing' | 'feeling',
    author: '',
  })
  const [writings, setWritings] = useState<Writing[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [loading, setLoading] = useState(true)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchWritings()
    }
  }, [status])

  const fetchWritings = async () => {
    try {
      setLoading(true)
      // Fetch only user's own writings
      const response = await fetch('/api/writings/my-writings')
      if (response.status === 401) {
        router.push('/login')
        return
      }
      const data = await response.json()
      setWritings(data)
    } catch (error) {
      console.error('Error fetching writings:', error)
      setMessage({ type: 'error', text: 'Failed to fetch writings' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId ? `/api/writings/${editingId}` : '/api/writings'
      const method = editingId ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.status === 401) {
        setMessage({ type: 'error', text: 'Please sign in to continue' })
        setTimeout(() => router.push('/login'), 1500)
        return
      }

      if (response.ok) {
        setMessage({ type: 'success', text: editingId ? 'Updated successfully!' : 'Added successfully!' })
        setFormData({ title: '', content: '', category: 'shayari', author: '' })
        setEditingId(null)
        fetchWritings()
        setTimeout(() => setMessage(null), 3000)
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Something went wrong!' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong!' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleEdit = (writing: Writing) => {
    setFormData({
      title: writing.title || '',
      content: writing.content,
      category: writing.category,
      author: writing.author || '',
    })
    setEditingId(writing.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return
    
    try {
      const response = await fetch(`/api/writings/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Deleted successfully!' })
        fetchWritings()
        setTimeout(() => setMessage(null), 3000)
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Failed to delete!' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete!' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  // Show loading while checking authentication
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="text-5xl text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {editingId ? 'Edit Writing' : 'Add New Writing'}
        </h1>
        <p className="text-gray-300">Share your thoughts, shayari, and feelings with the world</p>
        {session?.user.role !== 'admin' && (
          <div className="mt-4 p-4 rounded-xl bg-blue-500/20 border border-blue-500/50">
            <p className="text-blue-300 text-sm">
              ℹ️ Your submissions will be reviewed by the admin before appearing publicly.
            </p>
          </div>
        )}
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

      {/* Form */}
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-8 mb-12"
      >
        <div className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Category</label>
            <div className="flex gap-4">
              {['shayari', 'writing', 'feeling'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat as any })}
                  className={`px-6 py-2 rounded-full capitalize transition-all ${
                    formData.category === cat
                      ? 'glass-button ring-2 ring-purple-400'
                      : 'glass hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass focus:ring-2 focus:ring-purple-400 outline-none transition-all"
              placeholder="Give your writing a title..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={10}
              className="w-full px-4 py-3 rounded-xl glass focus:ring-2 focus:ring-purple-400 outline-none transition-all resize-none"
              placeholder="Write your heart out..."
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Author (Optional)
            </label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-3 rounded-xl glass focus:ring-2 focus:ring-purple-400 outline-none transition-all"
              placeholder="Your name or pen name..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 glass-button px-6 py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
            >
              <FiSave />
              <span>{editingId ? 'Update' : 'Publish'}</span>
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setFormData({ title: '', content: '', category: 'shayari', author: '' })
                }}
                className="px-6 py-3 rounded-xl glass hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </motion.form>

      {/* Writings List */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-purple-300">Manage Your Writings</h2>
        {loading ? (
          <div className="text-center py-12 glass-card rounded-xl">
            <FiLoader className="text-4xl text-purple-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading your writings...</p>
          </div>
        ) : writings.length === 0 ? (
          <div className="text-center py-12 glass-card rounded-xl">
            <p className="text-xl text-gray-300 mb-2">No writings yet</p>
            <p className="text-gray-400">Start by adding your first writing above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {writings.map((writing, index) => (
            <motion.div
              key={writing.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs bg-purple-500/30 text-purple-300 capitalize">
                      {writing.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      writing.status === 'approved' ? 'bg-green-500/30 text-green-300' :
                      writing.status === 'rejected' ? 'bg-red-500/30 text-red-300' :
                      'bg-yellow-500/30 text-yellow-300'
                    }`}>
                      {writing.status === 'approved' ? '✓ Approved' :
                       writing.status === 'rejected' ? '✗ Rejected' :
                       '⏳ Pending Review'}
                    </span>
                    <span className="text-gray-400 text-sm">{new Date(writing.date).toLocaleDateString()}</span>
                  </div>
                  {writing.title && (
                    <h3 className="text-xl font-semibold mb-2 text-purple-300">{writing.title}</h3>
                  )}
                  <p className="text-gray-300 line-clamp-2">{writing.content}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(writing)}
                    className="p-2 rounded-lg glass-button hover:bg-blue-500/30 transition-all"
                    title="Edit"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(writing.id)}
                    className="p-2 rounded-lg glass hover:bg-red-500/30 transition-all"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

