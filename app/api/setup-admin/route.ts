import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Setup admin user and sample data
export async function POST() {
  try {
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: 'asbhadane21@gmail.com' },
      update: {},
      create: {
        id: '1759705378150',
        email: 'asbhadane21@gmail.com',
        name: 'MrAmlya',
        password: '$2b$10$CyX9LeFAlX7WDHpJTglSEOHE9yQisanMIjmD/dQajD6lRTjylYDcK',
        role: 'admin',
        createdAt: new Date('2025-10-05T23:02:58.150Z'),
      }
    })
    
    // Create sample writings
    const writings = [
      {
        id: '1759706481375',
        title: 'test',
        content: 'test',
        category: 'shayari',
        author: 'amol',
        date: new Date('2025-10-05T23:21:21.375Z'),
        userId: '1759705378150',
        status: 'pending',
        likes: 0,
        comments: []
      },
      {
        id: '1759706599892',
        title: 'test',
        content: 'test',
        category: 'writing',
        author: 'amol',
        date: new Date('2025-10-05T23:23:19.892Z'),
        userId: '1759705378150',
        status: 'pending',
        likes: 0,
        comments: []
      },
      {
        id: '1759706776452',
        title: 'wow',
        content: 'wow',
        category: 'shayari',
        author: 'me',
        date: new Date('2025-10-05T23:26:16.452Z'),
        userId: '1759705378150',
        status: 'pending',
        likes: 0,
        comments: []
      }
    ]
    
    const createdWritings = []
    for (const writing of writings) {
      const created = await prisma.writing.upsert({
        where: { id: writing.id },
        update: {},
        create: writing
      })
      createdWritings.push(created)
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Admin setup completed',
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role
      },
      writingsCreated: createdWritings.length
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to setup admin',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
