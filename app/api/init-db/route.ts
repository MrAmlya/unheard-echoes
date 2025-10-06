import { NextResponse } from 'next/server'
import { ensureTablesExist } from '@/lib/db'

// POST - Initialize database tables (one-time setup)
export async function POST() {
  try {
    await ensureTablesExist()
    return NextResponse.json({ 
      message: 'Database initialized successfully',
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
    await ensureTablesExist()
    return NextResponse.json({ 
      message: 'Database is ready',
      status: 'success'
    })
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
