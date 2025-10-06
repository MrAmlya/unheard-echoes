import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// POST - Create admin user account
export async function POST() {
  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'asbhadane21@gmail.com' }
    })
    
    if (existingUser) {
      return NextResponse.json({
        status: 'success',
        message: 'Admin user already exists',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role
        }
      })
    }
    
    // Create admin user with the same password hash from JSON file
    const adminUser = await prisma.user.create({
      data: {
        id: '1759705378150', // Same ID from JSON file
        email: 'asbhadane21@gmail.com',
        name: 'MrAmlya',
        password: '$2b$10$CyX9LeFAlX7WDHpJTglSEOHE9yQisanMIjmD/dQajD6lRTjylYDcK', // Same hash from JSON
        role: 'admin',
        createdAt: new Date('2025-10-05T23:02:58.150Z'),
      }
    })
    
    return NextResponse.json({
      status: 'success',
      message: 'Admin user created successfully',
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      }
    })
  } catch (error) {
    console.error('Error creating admin user:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to create admin user',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
