import { NextRequest, NextResponse } from 'next/server'
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

async function writeWritings(writings: Writing[]) {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
  await fs.writeFile(DATA_FILE, JSON.stringify(writings, null, 2))
}

// GET - Fetch single writing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const writings = await readWritings()
    const writing = writings.find((w) => w.id === params.id)

    if (!writing) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(writing)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch writing' },
      { status: 500 }
    )
  }
}

// PUT - Update writing (requires authentication and ownership)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const index = writings.findIndex((w) => w.id === params.id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      )
    }

    // Check if user owns this writing
    if (writings[index].userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden. You can only edit your own writings.' },
        { status: 403 }
      )
    }

    writings[index] = {
      ...writings[index],
      title: title || undefined,
      content,
      category,
      author: author || undefined,
    }

    await writeWritings(writings)

    return NextResponse.json(writings[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update writing' },
      { status: 500 }
    )
  }
}

// DELETE - Remove writing (requires authentication and ownership)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    const writings = await readWritings()
    const writing = writings.find((w) => w.id === params.id)

    if (!writing) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      )
    }

    // Check if user owns this writing
    if (writing.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden. You can only delete your own writings.' },
        { status: 403 }
      )
    }

    const filteredWritings = writings.filter((w) => w.id !== params.id)
    await writeWritings(filteredWritings)

    return NextResponse.json({ message: 'Writing deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete writing' },
      { status: 500 }
    )
  }
}

