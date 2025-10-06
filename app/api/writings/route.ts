import { NextRequest, NextResponse } from 'next/server'
import { Writing } from '@/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readWritings, createWriting } from '@/lib/writings'

// GET - Fetch all writings (public - shows only approved writings)
export async function GET() {
  try {
    const writings = await readWritings()
    // Filter to only show approved writings for public view
    const approvedWritings = writings.filter(w => w.status === 'approved')
    return NextResponse.json(approvedWritings)
  } catch (error) {
    console.error('Error fetching writings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch writings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST - Create new writing (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, category, author } = body

    if (!content || !category) {
      return NextResponse.json(
        { error: 'Content and category are required' },
        { status: 400 }
      )
    }

    // Admin writings are auto-approved, others are pending
    const isAdmin = session.user.role === 'admin'
    
    const newWriting = await createWriting({
      title: title || undefined,
      content,
      category,
      author: author || undefined,
      userId: session.user.id,
      status: isAdmin ? 'approved' : 'pending',
      reviewedAt: isAdmin ? new Date().toISOString() : undefined,
      reviewedBy: isAdmin ? session.user.id : undefined,
    })

    return NextResponse.json(newWriting, { status: 201 })
  } catch (error) {
    console.error('Error creating writing:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create writing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

