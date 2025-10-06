import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Create admin user and sample writings
export async function POST() {
  try {
    let results = {
      adminUser: null,
      writings: []
    }
    
    // Create admin user
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: 'asbhadane21@gmail.com' }
      })
      
      if (!existingUser) {
        const adminUser = await prisma.user.create({
          data: {
            id: '1759705378150',
            email: 'asbhadane21@gmail.com',
            name: 'MrAmlya',
            password: '$2b$10$CyX9LeFAlX7WDHpJTglSEOHE9yQisanMIjmD/dQajD6lRTjylYDcK',
            role: 'admin',
            createdAt: new Date('2025-10-05T23:02:58.150Z'),
          }
        })
        results.adminUser = { id: adminUser.id, email: adminUser.email, role: adminUser.role }
      } else {
        results.adminUser = { id: existingUser.id, email: existingUser.email, role: existingUser.role }
      }
    } catch (error) {
      console.log('Admin user creation error:', error)
    }
    
    // Create sample writings
    const sampleWritings = [
      {
        id: '1759706481375',
        title: 'test',
        content: 'test',
        category: 'shayari',
        author: 'amol',
        date: new Date('2025-10-05T23:21:21.375Z'),
        userId: '1759705378150', // Admin user ID
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
      },
      {
        id: '1759706907489',
        title: 'She was beautiful in her own ways..',
        content: 'She was beautiful in her own ways..\nThe ways she tucked her hair everytime the wind blew..\nThe ways her eyes widened and shone brilliantly whenever she talked about her dreams..\nThe ways ice cream managed to find its place right up on her nose while she seemed to be in another parallel universe licking her ice cone..damn..!!\nHer loose sweat shirt..\nWith house shorts..\nMessy bun..\nEyes deeper than sea..\n\nYou know..\nShe never knew her beauty was her simplicity..\nHer ways to make others feel special..\nHer random acts of kindness towards the unknown..\nTowards those who seemed to be abandoned by this society..\n\nShe was simple..\nThe simplest..\nYet genuine..\nYet one in a million..',
        category: 'feeling',
        author: 'MrAmlya',
        date: new Date('2025-10-05T23:28:27.489Z'),
        userId: '1759705378150',
        status: 'approved',
        reviewedAt: new Date('2025-10-05T23:28:27.489Z'),
        reviewedBy: '1759705378150',
        likes: 3,
        comments: []
      }
    ]
    
    for (const writing of sampleWritings) {
      try {
        const existingWriting = await prisma.writing.findUnique({
          where: { id: writing.id }
        })
        
        if (!existingWriting) {
          const createdWriting = await prisma.writing.create({
            data: writing
          })
          results.writings.push({ id: createdWriting.id, title: createdWriting.title })
        }
      } catch (error) {
        console.log(`Writing ${writing.id} creation error:`, error)
      }
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Migration completed',
      results
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
