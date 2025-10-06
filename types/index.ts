export interface User {
  id: string
  email: string
  name: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface Comment {
  id: string
  writingId: string
  name: string
  text: string
  date: string
}

export interface Writing {
  id: string
  title?: string
  content: string
  category: 'shayari' | 'writing' | 'feeling'
  author?: string
  date: string
  userId: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedAt?: string
  reviewedBy?: string
  likes: number
  comments: Comment[]
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

