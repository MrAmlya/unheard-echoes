import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readWritings } from '@/lib/writings-prisma'
import { getUserById } from '@/lib/users-prisma'

// GET - Fetch all reviewed writings (approved and rejected) with review history
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    const dbUser = await getUserById(session.user.id)
    if (!dbUser || dbUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      )
    }

    const allWritings = await readWritings()
    
    // Filter to only reviewed writings (approved or rejected)
    const reviewedWritings = allWritings.filter(w => 
      w.status === 'approved' || w.status === 'rejected'
    )

    // Sort by review date (most recent first)
    const sortedWritings = reviewedWritings.sort((a, b) => {
      const dateA = new Date(a.reviewedAt || a.date).getTime()
      const dateB = new Date(b.reviewedAt || b.date).getTime()
      return dateB - dateA
    })

    return NextResponse.json(sortedWritings)
  } catch (error) {
    console.error('Error fetching reviewed writings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch reviewed writings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
