import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readWritings } from '@/lib/writings-prisma'
import { getUserById } from '@/lib/users-prisma'

// GET - Fetch pending writings (admin only)
export async function GET() {
  try {
    // Check authentication
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

    // Fetch all writings and filter for pending ones
    const allWritings = await readWritings()
    const pendingWritings = allWritings.filter(writing => writing.status === 'pending')

    return NextResponse.json(pendingWritings)
  } catch (error) {
    console.error('Error fetching pending writings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch pending writings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}