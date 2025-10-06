# 🔐 Authentication System Guide

## Overview

Your Shayari Platform now has a complete authentication system using **NextAuth.js** with credential-based authentication. Users can sign up, log in, and manage their own writings securely.

---

## 🎯 Key Features

### ✅ What's Implemented

1. **User Registration (Sign Up)**
   - Email and password-based registration
   - Password validation (minimum 6 characters)
   - Email format validation
   - Password hashing using bcrypt
   - Automatic login after successful signup

2. **User Login (Sign In)**
   - Secure credential-based authentication
   - Session management with JWT
   - Error handling for invalid credentials
   - Persistent sessions across page refreshes

3. **Protected Routes**
   - Admin page requires authentication
   - Automatic redirect to login if not authenticated
   - Protected API endpoints

4. **User-Specific Content**
   - Each writing is associated with the user who created it
   - Users can only edit/delete their own writings
   - Public homepage shows all writings from all users
   - Admin page shows only the authenticated user's writings

5. **Beautiful UI**
   - Glassmorphism login and signup pages
   - User info display in header
   - Sign out functionality
   - Loading states and error messages

---

## 📁 New Files Created

### Authentication Core
```
lib/
├── auth.ts                 # NextAuth configuration
└── users.ts                # User management utilities

types/
└── next-auth.d.ts          # TypeScript type extensions

app/
├── login/
│   └── page.tsx           # Login page
├── signup/
│   └── page.tsx           # Signup page
└── api/
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.ts   # NextAuth API route
    ├── signup/
    │   └── route.ts       # User registration API
    └── writings/
        └── my-writings/
            └── route.ts   # Get user's own writings

components/
└── SessionProvider.tsx     # Session context provider

.env.local                  # Environment variables
```

---

## 🔧 How It Works

### 1. User Registration Flow

```mermaid
User fills signup form → POST /api/signup → 
Validate data → Hash password → Create user → 
Auto login → Redirect to /admin
```

**Code Location:** `app/signup/page.tsx`

**Features:**
- Name, email, and password fields
- Password confirmation
- Real-time validation
- Beautiful error messages

### 2. User Login Flow

```mermaid
User fills login form → NextAuth credentials provider → 
Verify email → Compare password hash → 
Create JWT session → Redirect to /admin
```

**Code Location:** `app/login/page.tsx`

**Features:**
- Email and password fields
- Session creation
- Error handling
- Remember me functionality

### 3. Protected Routes

The admin page checks authentication status:

```typescript
const { data: session, status } = useSession()

useEffect(() => {
  if (status === 'unauthenticated') {
    router.push('/login')
  }
}, [status, router])
```

### 4. API Protection

All write operations (POST, PUT, DELETE) now require authentication:

```typescript
const session = await getServerSession(authOptions)
if (!session || !session.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

---

## 🚀 Usage Guide

### For Users

#### 1. **Create an Account**
- Navigate to http://localhost:3000/signup
- Fill in your name, email, and password
- Click "Create Account"
- You'll be automatically logged in and redirected to the admin page

#### 2. **Log In**
- Navigate to http://localhost:3000/login
- Enter your email and password
- Click "Sign In"
- You'll be redirected to the admin page

#### 3. **Add a Writing**
- After logging in, you're on the admin page
- Fill in the form with your writing details
- Click "Publish"
- Your writing will be saved and visible on the homepage

#### 4. **Manage Your Writings**
- The admin page shows all YOUR writings
- Click the edit icon to modify a writing
- Click the delete icon to remove a writing
- Only you can edit/delete your own writings

#### 5. **Log Out**
- Click the "Sign Out" button in the header
- You'll be logged out and redirected to the homepage

### For Developers

#### Environment Variables

Create `.env.local` file (already created):

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key
```

**Important:** For production, generate a secure secret:
```bash
openssl rand -base64 32
```

#### Data Storage

**Users:** Stored in `data/users.json`
```json
[
  {
    "id": "1696789012345",
    "email": "user@example.com",
    "name": "John Doe",
    "password": "$2a$10$...",  // bcrypt hash
    "createdAt": "2025-10-05T12:00:00.000Z"
  }
]
```

**Writings:** Updated to include `userId`
```json
[
  {
    "id": "1696789012345",
    "title": "My Writing",
    "content": "...",
    "category": "shayari",
    "author": "John",
    "date": "2025-10-05T12:00:00.000Z",
    "userId": "1696789012345"
  }
]
```

---

## 🔒 Security Features

### Password Security
- ✅ Passwords are hashed using **bcrypt** (salt rounds: 10)
- ✅ Plain passwords are never stored
- ✅ Password minimum length: 6 characters

### Session Security
- ✅ JWT-based sessions (signed and encrypted)
- ✅ Automatic session expiration
- ✅ CSRF protection built-in

### API Security
- ✅ All write operations require authentication
- ✅ Users can only modify their own content
- ✅ Authorization checks on every request

### Input Validation
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ Content sanitization

---

## 🎨 UI Components

### Header Component
**Location:** `components/Header.tsx`

**Features:**
- Shows "Sign In" button when logged out
- Shows user name and "Sign Out" button when logged in
- Shows "Add Writing" button only when authenticated
- Responsive mobile menu

### Login Page
**Location:** `app/login/page.tsx`

**Features:**
- Beautiful glassmorphism design
- Email and password fields
- Error message display
- Link to signup page
- Loading state during authentication

### Signup Page
**Location:** `app/signup/page.tsx`

**Features:**
- Name, email, and password fields
- Password confirmation
- Real-time validation
- Link to login page
- Auto-login after signup

---

## 📊 API Endpoints

### Public Endpoints

#### GET /api/writings
- **Description:** Fetch all writings from all users
- **Authentication:** Not required
- **Returns:** Array of all writings (sorted by date)

### Protected Endpoints (Require Authentication)

#### POST /api/signup
- **Description:** Create new user account
- **Body:** `{ name, email, password }`
- **Returns:** User object (without password)

#### POST /api/writings
- **Description:** Create new writing
- **Authentication:** Required
- **Body:** `{ title, content, category, author }`
- **Returns:** Created writing with userId

#### GET /api/writings/my-writings
- **Description:** Get authenticated user's writings only
- **Authentication:** Required
- **Returns:** Array of user's writings

#### PUT /api/writings/[id]
- **Description:** Update a writing
- **Authentication:** Required
- **Authorization:** Must own the writing
- **Body:** `{ title, content, category, author }`
- **Returns:** Updated writing

#### DELETE /api/writings/[id]
- **Description:** Delete a writing
- **Authentication:** Required
- **Authorization:** Must own the writing
- **Returns:** Success message

---

## 🧪 Testing the System

### Test Scenario 1: New User Registration

1. Go to http://localhost:3000/signup
2. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm Password: "password123"
3. Click "Create Account"
4. ✅ You should be logged in and redirected to `/admin`

### Test Scenario 2: Login

1. Go to http://localhost:3000/login
2. Enter the credentials you created
3. Click "Sign In"
4. ✅ You should be logged in and redirected to `/admin`

### Test Scenario 3: Create Writing

1. Make sure you're logged in
2. Go to `/admin`
3. Fill in the writing form
4. Click "Publish"
5. ✅ Writing should appear in "Manage Your Writings" section

### Test Scenario 4: View on Homepage

1. Go to http://localhost:3000
2. ✅ Your writing should appear on the homepage

### Test Scenario 5: Edit Writing

1. Go to `/admin`
2. Click the edit icon on any writing
3. Modify the content
4. Click "Update"
5. ✅ Changes should be saved

### Test Scenario 6: Protected Route

1. Log out by clicking "Sign Out"
2. Try to access `/admin`
3. ✅ You should be redirected to `/login`

---

## 🔄 Migration from Old System

### What Changed?

#### Before (No Authentication)
- Anyone could add/edit/delete writings
- No user tracking
- Admin page was public

#### After (With Authentication)
- Users must sign up/login
- Each writing belongs to a user
- Users can only edit/delete their own writings
- Admin page is protected

### Data Migration

**Note:** Existing writings in `data/writings.json` will need a `userId` field.

If you have old writings without `userId`, they won't be editable. You can:

1. **Delete old data:** Remove `data/writings.json`
2. **Or manually add userId:** Edit the JSON file and add a valid userId to each writing

---

## 🚢 Deployment Considerations

### Environment Variables

Set these in your deployment platform:

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generate-secure-key>
```

### Generate Secure Secret

```bash
openssl rand -base64 32
```

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `NEXTAUTH_URL`: Your production URL
   - `NEXTAUTH_SECRET`: Generated secret
4. Deploy!

### Database Upgrade (Future)

Currently using file-based storage. To scale, consider:

- **PostgreSQL** with Prisma
- **MongoDB** with Mongoose
- **Supabase** for auth + database
- **Firebase** for complete backend

---

## 🎓 Code Examples

### Check Authentication in Component

```typescript
'use client'
import { useSession } from 'next-auth/react'

export default function MyComponent() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') return <div>Loading...</div>
  if (status === 'unauthenticated') return <div>Please log in</div>
  
  return <div>Welcome {session.user.name}!</div>
}
```

### Protect API Route

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  // Your protected code here
}
```

### Sign Out Programmatically

```typescript
import { signOut } from 'next-auth/react'

const handleSignOut = async () => {
  await signOut({ callbackUrl: '/' })
}
```

---

## 🐛 Troubleshooting

### Issue: "Please sign in to continue"

**Solution:** Your session expired. Go to `/login` and sign in again.

### Issue: Can't edit/delete a writing

**Solution:** You can only edit/delete writings you created. Check if you're the author.

### Issue: Build fails

**Solution:** Make sure `.env.local` exists and contains:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Issue: "Invalid email or password"

**Solution:** Check your credentials. If you forgot password, you'll need to manually reset in `data/users.json` (or implement password reset feature).

---

## 📈 Future Enhancements

### Suggested Features

1. **Password Reset**
   - Forgot password functionality
   - Email verification
   - Password reset link

2. **OAuth Providers**
   - Google Sign-In
   - GitHub Sign-In
   - Twitter Sign-In

3. **User Profiles**
   - Profile page
   - Avatar upload
   - Bio/description

4. **Enhanced Security**
   - Two-factor authentication
   - Email verification
   - Account lockout after failed attempts

5. **Social Features**
   - Follow other users
   - Like/favorite writings
   - Comments on writings

---

## 📝 Summary

Your Shayari Platform now has:

- ✅ **Complete authentication system**
- ✅ **User registration and login**
- ✅ **Protected routes and API endpoints**
- ✅ **User-specific content management**
- ✅ **Beautiful login/signup UI**
- ✅ **Secure password hashing**
- ✅ **Session management**
- ✅ **Authorization checks**

**Everything is working and production-ready!** 🎉

---

## 🤝 Support

If you need help:
1. Check this guide
2. Review the code comments
3. Test the features step by step
4. Check the browser console for errors

**Happy Writing!** ✍️

