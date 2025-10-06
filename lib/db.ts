import { sql } from '@vercel/postgres'
import { User, Writing, Comment } from '@/types'

// Initialize database tables
export async function initDatabase() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create writings table
    await sql`
      CREATE TABLE IF NOT EXISTS writings (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500),
        content TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        author VARCHAR(255),
        date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        reviewed_at TIMESTAMP WITH TIME ZONE,
        reviewed_by VARCHAR(255),
        likes INTEGER DEFAULT 0,
        comments JSONB DEFAULT '[]'::jsonb,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `

    console.log('Database tables created successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

// Call this function to ensure tables exist
export async function ensureTablesExist() {
  await initDatabase()
}
