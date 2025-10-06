import { sql } from '@vercel/postgres'

// Test database connection
export async function testConnection() {
  try {
    await sql`SELECT 1 as test`
    return { success: true, message: 'Database connected successfully' }
  } catch (error) {
    console.error('Database connection error:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown connection error' 
    }
  }
}

// Initialize database tables with better error handling
export async function initDatabase() {
  try {
    // Test connection first
    const connectionTest = await testConnection()
    if (!connectionTest.success) {
      throw new Error(`Connection failed: ${connectionTest.message}`)
    }

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
    return { success: true, message: 'Database initialized successfully' }
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}
