import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Setup database tables
export async function POST() {
  try {
    // Test connection
    await prisma.$connect()
    
    // Try to create a test user to see if tables exist
    try {
      await prisma.user.findFirst()
      return NextResponse.json({ 
        message: 'Database tables already exist',
        status: 'success'
      })
    } catch (error) {
      // Tables don't exist, create them manually
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `
      
      await prisma.$executeRaw`
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
      
      return NextResponse.json({ 
        message: 'Database tables created successfully',
        status: 'success'
      })
    }
  } catch (error) {
    console.error('Error setting up database:', error)
    return NextResponse.json(
      { 
        error: 'Failed to setup database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
