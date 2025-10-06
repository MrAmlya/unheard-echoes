import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Writing } from '@/types'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const DATA_FILE = path.join(process.cwd(), 'data', 'writings.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read writings from file
async function readWritings(): Promise<Writing[]> {
  try {
    await ensureDataDirectory()
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    // If file doesn't exist, return empty array
    return []
  }
}

// Write writings to file
async function writeWritings(writings: Writing[]) {
  await ensureDataDirectory()
  await fs.writeFile(DATA_FILE, JSON.stringify(writings, null, 2))
}

// GET - Fetch all writings (public - shows only approved writings)
export async function GET() {
  try {
    const writings = await readWritings()
    // Filter to only show approved writings for public view
    const approvedWritings = writings.filter(w => w.status === 'approved')
    // Sort by date, newest first
    const sortedWritings = approvedWritings.sort((a, b) => 
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

// POST - Create new writing (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
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

    const writings = await readWritings()
    
    // Admin writings are auto-approved, others are pending
    const isAdmin = session.user.role === 'admin'
    
    const newWriting: Writing = {
      id: Date.now().toString(),
      title: title || undefined,
      content,
      category,
      author: author || undefined,
      date: new Date().toISOString(),
      userId: session.user.id,
      status: isAdmin ? 'approved' : 'pending',
      reviewedAt: isAdmin ? new Date().toISOString() : undefined,
      reviewedBy: isAdmin ? session.user.id : undefined,
      likes: 0,
      comments: [],
    }

    writings.push(newWriting)
    await writeWritings(writings)

    return NextResponse.json(newWriting, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create writing' },
      { status: 500 }
    )
  }
}

