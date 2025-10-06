import { NextRequest, NextResponse } from 'next/server'
import { getWritingById, updateWriting } from '@/lib/writings'

// POST - Toggle like on a writing (public - no auth required)
export async function POST(
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

    // Increment likes count
    const newLikes = (writing.likes || 0) + 1
    await updateWriting(params.id, { likes: newLikes })

    return NextResponse.json({ 
      likes: newLikes,
      message: 'Liked successfully'
    })
  } catch (error) {
    console.error('Error liking writing:', error)
    return NextResponse.json(
      { 
        error: 'Failed to like writing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

