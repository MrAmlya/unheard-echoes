import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Debug endpoint to test database connection
export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Test if we can query the database
    const userCount = await prisma.user.count()
    const writingCount = await prisma.writing.count()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection working',
      userCount,
      writingCount,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
