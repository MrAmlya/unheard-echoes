import { sql } from '@vercel/postgres'
import { Writing, Comment } from '@/types'
import { ensureTablesExist } from './db'

// Helper function to map database row to Writing object
function mapRowToWriting(row: any): Writing {
  return {
    id: row.id,
    title: row.title || undefined,
    content: row.content,
    category: row.category,
    author: row.author || undefined,
    date: row.date.toISOString(),
    userId: row.user_id,
    status: row.status,
    reviewedAt: row.reviewed_at?.toISOString() || undefined,
    reviewedBy: row.reviewed_by || undefined,
    likes: row.likes || 0,
    comments: (row.comments || []) as Comment[],
  }
}

// Read all writings
export async function readWritings(): Promise<Writing[]> {
  try {
    await ensureTablesExist()
    const { rows } = await sql`
      SELECT * FROM writings ORDER BY date DESC
    `
    return rows.map(mapRowToWriting)
  } catch (error) {
    console.error('Error reading writings:', error)
    throw error
  }
}

// Get writing by ID
export async function getWritingById(id: string): Promise<Writing | null> {
  try {
    await ensureTablesExist()
    const { rows } = await sql`
      SELECT * FROM writings WHERE id = ${id}
    `
    if (rows.length === 0) return null
    return mapRowToWriting(rows[0])
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
    await ensureTablesExist()
    const id = Date.now().toString()
    
    const { rows } = await sql`
      INSERT INTO writings (id, title, content, category, author, user_id, status, reviewed_at, reviewed_by, likes, comments)
      VALUES (
        ${id},
        ${writingData.title || null},
        ${writingData.content},
        ${writingData.category},
        ${writingData.author || null},
        ${writingData.userId},
        ${writingData.status},
        ${writingData.reviewedAt || null},
        ${writingData.reviewedBy || null},
        ${writingData.likes || 0},
        ${JSON.stringify(writingData.comments || [])}::jsonb
      )
      RETURNING *
    `
    return mapRowToWriting(rows[0])
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
    await ensureTablesExist()
    
    // Handle specific update cases
    if (updates.likes !== undefined) {
      const { rows } = await sql`
        UPDATE writings
        SET likes = ${updates.likes}
        WHERE id = ${id}
        RETURNING *
      `
      if (rows.length === 0) return null
      return mapRowToWriting(rows[0])
    }
    
    if (updates.comments !== undefined) {
      const { rows } = await sql`
        UPDATE writings
        SET comments = ${JSON.stringify(updates.comments)}::jsonb
        WHERE id = ${id}
        RETURNING *
      `
      if (rows.length === 0) return null
      return mapRowToWriting(rows[0])
    }
    
    if (updates.status !== undefined) {
      const { rows } = await sql`
        UPDATE writings
        SET status = ${updates.status},
            reviewed_at = ${updates.reviewedAt || null},
            reviewed_by = ${updates.reviewedBy || null}
        WHERE id = ${id}
        RETURNING *
      `
      if (rows.length === 0) return null
      return mapRowToWriting(rows[0])
    }
    
    // If no specific updates, return current writing
    return getWritingById(id)
  } catch (error) {
    console.error('Error updating writing:', error)
    throw error
  }
}

// Delete writing
export async function deleteWriting(id: string): Promise<boolean> {
  try {
    await ensureTablesExist()
    
    const result = await sql`
      DELETE FROM writings WHERE id = ${id}
    `
    
    return (result.rowCount || 0) > 0
  } catch (error) {
    console.error('Error deleting writing:', error)
    throw error
  }
}
