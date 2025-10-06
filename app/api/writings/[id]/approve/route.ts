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
    
    // Check if user is admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden. Admin access required.' },
        { status: 403 }
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

    // Update writing status to approved
    writings[index] = {
      ...writings[index],
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: session.user.id,
    }

    await writeWritings(writings)

    return NextResponse.json({ 
      message: 'Writing approved successfully',
      writing: writings[index]
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to approve writing' },
      { status: 500 }
    )
  }
}

