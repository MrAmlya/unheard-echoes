import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Writing } from '@/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const DATA_FILE = path.join(process.cwd(), 'data', 'writings.json')

async function readWritings(): Promise<Writing[]> {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    return []
  }
}

// GET - Fetch user's own writings only
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    const writings = await readWritings()
    // Filter to only show writings belonging to the current user
    const userWritings = writings.filter((w) => w.userId === session.user.id)
    
    // Sort by date, newest first
    const sortedWritings = userWritings.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    return NextResponse.json(sortedWritings)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch writings' },
      { status: 500 }
    )
  }
}

