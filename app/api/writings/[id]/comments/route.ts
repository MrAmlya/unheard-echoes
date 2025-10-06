import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Writing, Comment } from '@/types'

const DATA_FILE = path.join(process.cwd(), 'data', 'writings.json')

async function readWritings(): Promise<Writing[]> {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    return []
  }
}

async function writeWritings(writings: Writing[]) {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  await fs.writeFile(DATA_FILE, JSON.stringify(writings, null, 2))
}

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

    const writings = await readWritings()
    const index = writings.findIndex((w) => w.id === params.id)

    if (index === -1) {
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

    // Initialize comments array if it doesn't exist
    if (!writings[index].comments) {
      writings[index].comments = []
    }

    writings[index].comments.push(newComment)

    await writeWritings(writings)

    return NextResponse.json({ 
      comment: newComment,
      message: 'Comment added successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    )
  }
}

