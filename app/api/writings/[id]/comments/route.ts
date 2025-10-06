import { NextRequest, NextResponse } from 'next/server'
import { Comment } from '@/types'
import { getWritingById, updateWriting } from '@/lib/writings'

// POST - Add a comment (public - no auth required)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, text } = body

    if (!name || !text) {
      return NextResponse.json(
        { error: 'Name and comment text are required' },
        { status: 400 }
      )
    }

    // Validate input lengths
    if (name.length > 50) {
      return NextResponse.json(
        { error: 'Name must be 50 characters or less' },
        { status: 400 }
      )
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Comment must be 500 characters or less' },
        { status: 400 }
      )
    }

    const writing = await getWritingById(params.id)

    if (!writing) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      )
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      writingId: params.id,
      name: name.trim(),
      text: text.trim(),
      date: new Date().toISOString(),
    }

    // Add comment to existing comments
    const updatedComments = [...(writing.comments || []), newComment]
    await updateWriting(params.id, { comments: updatedComments })

    return NextResponse.json({ 
      comment: newComment,
      message: 'Comment added successfully'
    })
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json(
      { 
        error: 'Failed to add comment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

