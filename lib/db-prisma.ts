import { prisma } from './prisma'
import { User, Writing, Comment } from '@/types'

// Initialize database tables
export async function initDatabase() {
  try {
    // Test connection
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // The tables will be created automatically by Prisma when we first use them
    return { success: true, message: 'Database connected successfully' }
  } catch (error) {
    console.error('Error connecting to database:', error)
    throw error
  }
}

// Test database connection
export async function testConnection() {
  try {
    await prisma.$connect()
    return { success: true, message: 'Database connected successfully' }
  } catch (error) {
    console.error('Database connection error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown connection error' 
    }
  }
}
