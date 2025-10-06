import { prisma } from './prisma'
import { Writing, Comment } from '@/types'

// Helper function to map Prisma result to Writing object
function mapPrismaToWriting(prismaWriting: any): Writing {
  return {
    id: prismaWriting.id,
    title: prismaWriting.title || undefined,
    content: prismaWriting.content,
    category: prismaWriting.category,
    author: prismaWriting.author || undefined,
    date: prismaWriting.date.toISOString(),
    userId: prismaWriting.userId,
    status: prismaWriting.status,
    reviewedAt: prismaWriting.reviewedAt?.toISOString() || undefined,
    reviewedBy: prismaWriting.reviewedBy || undefined,
    likes: prismaWriting.likes || 0,
    comments: (prismaWriting.comments || []) as Comment[],
  }
}

// Read all writings
export async function readWritings(): Promise<Writing[]> {
  try {
    const writings = await prisma.writing.findMany({
      orderBy: { date: 'desc' }
    })
    return writings.map(mapPrismaToWriting)
  } catch (error) {
    console.error('Error reading writings:', error)
    throw error
  }
}

// Get writing by ID
export async function getWritingById(id: string): Promise<Writing | null> {
  try {
    const writing = await prisma.writing.findUnique({
      where: { id }
    })
    if (!writing) return null
    return mapPrismaToWriting(writing)
  } catch (error) {
    console.error('Error getting writing by ID:', error)
    throw error
  }
}

// Create new writing
export async function createWriting(
  writingData: Omit<Writing, 'id' | 'date' | 'likes' | 'comments'> & {
    likes?: number
    comments?: Comment[]
  }
): Promise<Writing> {
  try {
    const writing = await prisma.writing.create({
      data: {
        title: writingData.title || null,
        content: writingData.content,
        category: writingData.category,
        author: writingData.author || null,
        userId: writingData.userId,
        status: writingData.status,
        reviewedAt: writingData.reviewedAt ? new Date(writingData.reviewedAt) : null,
        reviewedBy: writingData.reviewedBy || null,
        likes: writingData.likes || 0,
        comments: (writingData.comments || []) as any,
      }
    })
    return mapPrismaToWriting(writing)
  } catch (error) {
    console.error('Error creating writing:', error)
    throw error
  }
}

// Update writing
export async function updateWriting(
  id: string,
  updates: Partial<Omit<Writing, 'id' | 'date' | 'userId'>>
): Promise<Writing | null> {
  try {
    const updateData: any = {}
    
    // Handle basic writing fields
    if (updates.title !== undefined) updateData.title = updates.title
    if (updates.content !== undefined) updateData.content = updates.content
    if (updates.category !== undefined) updateData.category = updates.category
    if (updates.author !== undefined) updateData.author = updates.author
    
    // Handle likes
    if (updates.likes !== undefined) {
      updateData.likes = updates.likes
    }
    
    // Handle comments
    if (updates.comments !== undefined) {
      updateData.comments = updates.comments as any
    }
    
    // Handle status and review fields
    if (updates.status !== undefined) {
      updateData.status = updates.status
      updateData.reviewedAt = updates.reviewedAt ? new Date(updates.reviewedAt) : null
      updateData.reviewedBy = updates.reviewedBy || null
    }
    
    const writing = await prisma.writing.update({
      where: { id },
      data: updateData
    })
    
    return mapPrismaToWriting(writing)
  } catch (error) {
    console.error('Error updating writing:', error)
    throw error
  }
}

// Delete writing
export async function deleteWriting(id: string): Promise<boolean> {
  try {
    await prisma.writing.delete({
      where: { id }
    })
    return true
  } catch (error) {
    console.error('Error deleting writing:', error)
    throw error
  }
}
