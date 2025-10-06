'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import WritingCard from '@/components/WritingCard'
import WritingModal from '@/components/WritingModal'
import { Writing } from '@/types'

export default function Home() {
  const [writings, setWritings] = useState<Writing[]>([])
  const [filter, setFilter] = useState<'all' | 'shayari' | 'writing' | 'feeling'>('all')
  const [loading, setLoading] = useState(true)
  const [selectedWriting, setSelectedWriting] = useState<Writing | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (writing: Writing) => {
    setSelectedWriting(writing)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedWriting(null), 300) // Wait for animation to finish
  }

  useEffect(() => {
    fetchWritings()
  }, [])

  const fetchWritings = async () => {
    try {
      const response = await fetch('/api/writings')
      const data = await response.json()
      setWritings(data)
    } catch (error) {
      console.error('Error fetching writings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredWritings = writings.filter(writing => 
    filter === 'all' ? true : writing.category === filter
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 mt-8"
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Unheard Echoes
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8">
          Where unspoken words find their voice
        </p>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        {['all', 'shayari', 'writing', 'feeling'].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category as any)}
            className={`glass-button px-6 py-3 rounded-full font-medium capitalize transition-all ${
              filter === category 
                ? 'ring-2 ring-purple-400 bg-purple-500/40' 
                : 'hover:bg-purple-500/30'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Writings Grid */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-400 border-r-transparent"></div>
          <p className="mt-4 text-gray-300">Loading beautiful words...</p>
        </div>
      ) : filteredWritings.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 glass-card rounded-3xl p-12"
        >
          <p className="text-2xl text-gray-300">No writings found in this category yet.</p>
          <p className="text-gray-400 mt-2">Check back soon for more heartfelt content!</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {filteredWritings.map((writing) => (
            <motion.div key={writing.id} variants={itemVariants}>
              <WritingCard 
                writing={writing} 
                onClick={() => handleCardClick(writing)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Writing Modal */}
      <WritingModal
        writing={selectedWriting}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdate={fetchWritings}
      />
    </div>
  )
}

