import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { Writing } from '@/types'

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

// POST - Toggle like on a writing (public - no auth required)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const writings = await readWritings()
    const index = writings.findIndex((w) => w.id === params.id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Writing not found' },
        { status: 404 }
      )
    }

    // Increment likes count
    writings[index].likes = (writings[index].likes || 0) + 1

    await writeWritings(writings)

    return NextResponse.json({ 
      likes: writings[index].likes,
      message: 'Liked successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to like writing' },
      { status: 500 }
    )
  }
}

