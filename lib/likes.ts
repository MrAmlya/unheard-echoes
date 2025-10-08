import { prisma } from './prisma'

// Generate a unique identifier for anonymous users
function generateAnonymousId(request: Request): string {
  // Use IP address and user agent to create a unique identifier
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Create a simple hash-like identifier
  return Buffer.from(`${ip}-${userAgent}`).toString('base64').slice(0, 20)
}

// Check if user has liked a writing
export async function hasUserLiked(writingId: string, userId?: string, anonymousId?: string): Promise<boolean> {
  try {
    if (userId) {
      // Check for authenticated user
      const like = await prisma.like.findUnique({
        where: {
          userId_writingId: {
            userId,
            writingId
          }
        }
      })
      return !!like
    } else if (anonymousId) {
      // For anonymous users, we'll use a different approach
      // We'll store anonymous likes in a separate way or use localStorage
      // For now, we'll return false to allow multiple likes from anonymous users
      return false
    }
    return false
  } catch (error) {
    console.error('Error checking if user liked:', error)
    return false
  }
}

// Toggle like for a writing
export async function toggleLike(
  writingId: string, 
  userId?: string, 
  anonymousId?: string
): Promise<{ liked: boolean; likesCount: number }> {
  try {
    if (userId) {
      // Handle authenticated user
      const existingLike = await prisma.like.findUnique({
        where: {
          userId_writingId: {
            userId,
            writingId
          }
        }
      })

      if (existingLike) {
        // Unlike: remove the like
        await prisma.like.delete({
          where: {
            userId_writingId: {
              userId,
              writingId
            }
          }
        })
        
        // Decrement likes count
        await prisma.writing.update({
          where: { id: writingId },
          data: {
            likes: {
              decrement: 1
            }
          }
        })
        
        return { liked: false, likesCount: await getLikesCount(writingId) }
      } else {
        // Like: add the like
        await prisma.like.create({
          data: {
            userId,
            writingId
          }
        })
        
        // Increment likes count
        await prisma.writing.update({
          where: { id: writingId },
          data: {
            likes: {
              increment: 1
            }
          }
        })
        
        return { liked: true, likesCount: await getLikesCount(writingId) }
      }
    } else {
      // Handle anonymous user - always allow liking (no unlike for anonymous)
      // The frontend will handle preventing multiple likes using localStorage
      await prisma.writing.update({
        where: { id: writingId },
        data: {
          likes: {
            increment: 1
          }
        }
      })
      
      return { liked: true, likesCount: await getLikesCount(writingId) }
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    throw error
  }
}

// Get likes count for a writing
export async function getLikesCount(writingId: string): Promise<number> {
  try {
    const writing = await prisma.writing.findUnique({
      where: { id: writingId },
      select: { likes: true }
    })
    return writing?.likes || 0
  } catch (error) {
    console.error('Error getting likes count:', error)
    return 0
  }
}

// Get anonymous ID from request
export function getAnonymousId(request: Request): string {
  return generateAnonymousId(request)
}
