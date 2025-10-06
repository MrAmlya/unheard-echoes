import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getWritingById, updateWriting } from '@/lib/writings-prisma'
import { getUserById } from '@/lib/users-prisma'

// POST - Approve a writing (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }
    
    // Verify user exists in database and is admin
    const dbUser = await getUserById(session.user.id)
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database. Please sign in again.' },
        { status: 401 }
      )
    }
    
    if (dbUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      )
    }

    const writing = await getWritingById(params.id)
    if (!writing) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      )
    }

    // Update writing status to approved
    const updatedWriting = await updateWriting(params.id, {
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: session.user.id,
    })

    return NextResponse.json({ 
      message: 'Writing approved successfully',
      writing: updatedWriting
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to approve writing' },
      { status: 500 }
    )
  }
}

