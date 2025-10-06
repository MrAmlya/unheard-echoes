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

// GET - Fetch pending writings (admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }
    
    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
      )
    }

    const writings = await readWritings()
    // Filter to only show pending writings
    const pendingWritings = writings.filter(w => w.status === 'pending')
    
    // Sort by date, newest first
    const sortedWritings = pendingWritings.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    return NextResponse.json(sortedWritings)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pending writings' },
      { status: 500 }
    )
  }
}

