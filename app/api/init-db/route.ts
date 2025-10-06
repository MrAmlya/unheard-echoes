import { NextResponse } from 'next/server'
import { initDatabase, testConnection } from '@/lib/db-connection'

// POST - Initialize database tables (one-time setup)
export async function POST() {
  try {
    const result = await initDatabase()
    return NextResponse.json({ 
      message: result.message,
      status: 'success'
    })
  } catch (error) {
    console.error('Error initializing database:', error)
    return NextResponse.json(
      { 
        error: 'Failed to initialize database',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET - Check database status
export async function GET() {
  try {
    const result = await testConnection()
    if (result.success) {
      return NextResponse.json({ 
        message: 'Database is ready',
        status: 'success'
      })
    } else {
      return NextResponse.json(
        { 
          error: 'Database not ready',
          details: result.message
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error checking database:', error)
    return NextResponse.json(
      { 
        error: 'Database not ready',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
