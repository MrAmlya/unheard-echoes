import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { readWritings } from '@/lib/writings-prisma'
import { getUserById } from '@/lib/users-prisma'

// GET - Fetch user's own writings
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

    // Verify user exists in database
    const dbUser = await getUserById(session.user.id)
    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database. Please sign in again.' },
        { status: 401 }
      )
    }

    // Fetch all writings and filter for user's own writings
    const allWritings = await readWritings()
    const userWritings = allWritings.filter(writing => writing.userId === session.user.id)

    return NextResponse.json(userWritings)
  } catch (error) {
    console.error('Error fetching user writings:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch user writings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}