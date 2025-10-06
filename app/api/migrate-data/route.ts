import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { User, Writing } from '@/types'

// POST - Migrate data from JSON files to database
export async function POST() {
  try {
    const dataDir = path.join(process.cwd(), 'data')
    
    // Read users from JSON file
    const usersFile = path.join(dataDir, 'users.json')
    const usersData = await fs.readFile(usersFile, 'utf-8')
    const users: User[] = JSON.parse(usersData)
    
    // Read writings from JSON file
    const writingsFile = path.join(dataDir, 'writings.json')
    const writingsData = await fs.readFile(writingsFile, 'utf-8')
    const writings: Writing[] = JSON.parse(writingsData)
    
    let migratedUsers = 0
    let migratedWritings = 0
    
    // Migrate users
    for (const user of users) {
      try {
        await prisma.user.create({
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            password: user.password,
            role: user.role,
            createdAt: new Date(user.createdAt),
          }
        })
        migratedUsers++
      } catch (error) {
        console.log(`User ${user.email} might already exist, skipping...`)
      }
    }
    
    // Migrate writings
    for (const writing of writings) {
      try {
        await prisma.writing.create({
          data: {
            id: writing.id,
            title: writing.title || null,
            content: writing.content,
            category: writing.category,
            author: writing.author || null,
            date: new Date(writing.date),
            userId: writing.userId,
            status: writing.status,
            reviewedAt: writing.reviewedAt ? new Date(writing.reviewedAt) : null,
            reviewedBy: writing.reviewedBy || null,
            likes: writing.likes || 0,
            comments: (writing.comments || []) as any,
          }
        })
        migratedWritings++
      } catch (error) {
        console.log(`Writing ${writing.id} might already exist, skipping...`)
      }
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Data migration completed',
      migratedUsers,
      migratedWritings,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to migrate data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
