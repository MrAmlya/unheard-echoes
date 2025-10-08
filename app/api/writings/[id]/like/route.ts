import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getWritingById } from '@/lib/writings-prisma'
import { toggleLike, getAnonymousId } from '@/lib/likes'

// POST - Toggle like on a writing (supports both authenticated and anonymous users)
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

    // Check if user is authenticated
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id
    const anonymousId = userId ? undefined : getAnonymousId(request)

    // Toggle the like
    const result = await toggleLike(params.id, userId, anonymousId)

    return NextResponse.json({ 
      liked: result.liked,
      likes: result.likesCount,
      message: result.liked ? 'Liked successfully' : 'Unliked successfully'
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { 
        error: 'Failed to toggle like',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

