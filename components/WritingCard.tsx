'use client'

import { Writing } from '@/types'
import { FiCalendar, FiTag, FiHeart, FiMessageCircle, FiShare2 } from 'react-icons/fi'

interface WritingCardProps {
  writing: Writing
  onClick?: () => void
}

export default function WritingCard({ writing, onClick }: WritingCardProps) {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the modal
    const url = `${window.location.origin}/writing/${writing.id}`
    const text = `Check out this beautiful writing "${writing.title || 'Untitled'}" on Unheard Echoes! 🎭✨`
    
    if (navigator.share) {
      navigator.share({
        title: writing.title || 'Untitled',
        text: text,
        url: url
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(url)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div 
      onClick={onClick}
      className="glass-card rounded-2xl p-6 h-full flex flex-col cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(writing.category)}`}>
          <FiTag className="inline mr-1" />
          {writing.category}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full glass-button hover:scale-110 transition-all"
            title="Share this writing"
          >
            <FiShare2 className="text-blue-400 text-sm" />
          </button>
          <span className="text-gray-400 text-sm flex items-center">
            <FiCalendar className="mr-1" />
            {formatDate(writing.date)}
          </span>
        </div>
      </div>

      {/* Title */}
      {writing.title && (
        <h3 className="text-2xl font-bold mb-3 text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
          {writing.title}
        </h3>
      )}

      {/* Content */}
      <div className="flex-grow">
        <p className={`text-gray-200 whitespace-pre-wrap ${
          writing.category === 'shayari' ? 'shayari-text text-center' : ''
        }`}>
          {writing.content.length > 300 
            ? writing.content.substring(0, 300) + '...' 
            : writing.content}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          {/* Author */}
          {writing.author && (
            <p className="text-gray-400 text-sm italic">— {writing.author}</p>
          )}
          
          {/* Likes and Comments Count */}
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <FiHeart className="text-red-400" />
              {writing.likes || 0}
            </span>
            <span className="flex items-center gap-1">
              <FiMessageCircle className="text-purple-400" />
              {writing.comments?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

