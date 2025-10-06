import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getWritingById, updateWriting, deleteWriting } from '@/lib/writings-prisma'
import { getUserById } from '@/lib/users-prisma'

// GET - Fetch single writing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const writing = await getWritingById(params.id)

    if (!writing) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(writing)
  } catch (error) {
    console.error('Error fetching writing:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch writing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT - Update writing (requires authentication and ownership)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    // Verify user exists in database
    const dbUser = await getUserById(session.user.id)
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database. Please sign in again.' },
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

    // Check if writing exists
    const existingWriting = await getWritingById(params.id)
    if (!existingWriting) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      )
    }

    // Check if user owns this writing
    if (existingWriting.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden. You can only edit your own writings.' },
        { status: 403 }
      )
    }

    // Update the writing
    const updatedWriting = await updateWriting(params.id, {
      title: title || undefined,
      content,
      category,
      author: author || undefined,
    })

    return NextResponse.json(updatedWriting)
  } catch (error) {
    console.error('Error updating writing:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update writing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE - Remove writing (requires authentication and ownership)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    // Verify user exists in database
    const dbUser = await getUserById(session.user.id)
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database. Please sign in again.' },
        { status: 401 }
      )
    }

    // Check if writing exists
    const writing = await getWritingById(params.id)
    if (!writing) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      )
    }

    // Check if user owns this writing
    if (writing.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden. You can only delete your own writings.' },
        { status: 403 }
      )
    }

    // Delete the writing
    const success = await deleteWriting(params.id)
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete writing' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Writing deleted successfully' })
  } catch (error) {
    console.error('Error deleting writing:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete writing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

