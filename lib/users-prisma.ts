import { prisma } from './prisma'
import { User } from '@/types'

// Get user by email
export async function getUser(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    if (!user) return null
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role as 'admin' | 'user',
      createdAt: user.createdAt.toISOString(),
    }
  } catch (error) {
    console.error('Error getting user by email:', error)
    throw error
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!user) return null
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role as 'admin' | 'user',
      createdAt: user.createdAt.toISOString(),
    }
  } catch (error) {
    console.error('Error getting user by ID:', error)
    throw error
  }
}

// Create new user
export async function createUser(email: string, name: string, hashedPassword: string): Promise<User> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
    
    if (existingUser) {
      throw new Error('User with this email already exists')
    }
    
    // Check if this is the first user (admin)
    const userCount = await prisma.user.count()
    const isFirstUser = userCount === 0
    
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        password: hashedPassword,
        role: isFirstUser ? 'admin' : 'user',
      }
    })
    
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role as 'admin' | 'user',
      createdAt: user.createdAt.toISOString(),
    }
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Check if user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await getUserById(userId)
  return user?.role === 'admin'
}
