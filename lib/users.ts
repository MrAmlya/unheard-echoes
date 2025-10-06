import { sql } from '@vercel/postgres'
import { User } from '@/types'
import { ensureTablesExist } from './db'

// Get user by email
export async function getUser(email: string): Promise<User | null> {
  try {
    await ensureTablesExist()
    const { rows } = await sql`
      SELECT id, email, name, password, role, created_at
      FROM users
      WHERE email = ${email.toLowerCase()}
    `
    if (rows.length === 0) return null
    const user = rows[0]
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role as 'admin' | 'user',
      createdAt: user.created_at.toISOString(),
    }
  } catch (error) {
    console.error('Error getting user by email:', error)
    throw error
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    await ensureTablesExist()
    const { rows } = await sql`
      SELECT id, email, name, password, role, created_at
      FROM users
      WHERE id = ${id}
    `
    if (rows.length === 0) return null
    const user = rows[0]
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role as 'admin' | 'user',
      createdAt: user.created_at.toISOString(),
    }
  } catch (error) {
    console.error('Error getting user by ID:', error)
    throw error
  }
}

// Create new user
export async function createUser(email: string, name: string, hashedPassword: string): Promise<User> {
  try {
    await ensureTablesExist()
    
    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `
    
    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists')
    }
    
    // Check if this is the first user (admin)
    const userCount = await sql`SELECT COUNT(*) as count FROM users`
    const isFirstUser = parseInt(userCount.rows[0].count) === 0
    
    const userId = Date.now().toString()
    const role = isFirstUser ? 'admin' : 'user'
    
    // Insert new user
    await sql`
      INSERT INTO users (id, email, name, password, role, created_at)
      VALUES (${userId}, ${email.toLowerCase()}, ${name}, ${hashedPassword}, ${role}, NOW())
    `
    
    return {
      id: userId,
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      role,
      createdAt: new Date().toISOString(),
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