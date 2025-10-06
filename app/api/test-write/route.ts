import { NextResponse } from 'next/server'
import { createWriting } from '@/lib/writings-prisma'

// POST - Test writing creation without authentication
export async function POST() {
  try {
    const testWriting = await createWriting({
      title: 'Test Writing',
      content: 'This is a test writing to verify database operations work.',
      category: 'writing',
      author: 'Test User',
      userId: 'test-user-id',
      status: 'approved',
    })

    return NextResponse.json({
      status: 'success',
      message: 'Test writing created successfully',
      writing: testWriting
    })
  } catch (error) {
    console.error('Test write error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create test writing',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
