import { promises as fs } from 'fs'
import path from 'path'
import { User } from '@/types'

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read users from file
export async function readUsers(): Promise<User[]> {
  try {
    await ensureDataDirectory()
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    return []
  }
}

// Write users to file
export async function writeUsers(users: User[]) {
  await ensureDataDirectory()
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2))
}

// Get user by email
export async function getUser(email: string): Promise<User | null> {
  const users = await readUsers()
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  const users = await readUsers()
  return users.find(user => user.id === id) || null
}

// Create new user
export async function createUser(email: string, name: string, hashedPassword: string): Promise<User> {
  const users = await readUsers()
  
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  // First user is automatically admin, rest are regular users
  const isFirstUser = users.length === 0
  
  const newUser: User = {
    id: Date.now().toString(),
    email: email.toLowerCase(),
    name,
    password: hashedPassword,
    role: isFirstUser ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  await writeUsers(users)

  return newUser
}

// Check if user is admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await getUserById(userId)
  return user?.role === 'admin'
}

