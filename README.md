# 🎭 Unheard Echoes

A beautiful, full-stack web application with glassmorphism design where unspoken words find their voice. Share your writings, poetry, and feelings in an elegant platform. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- 🎨 **Beautiful Glassmorphism UI** - Modern, visually appealing design with glass effects
- 📱 **Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🔐 **User Authentication** - Secure sign up and login with NextAuth.js
- 👤 **User Accounts** - Each user has their own account and writings
- 🔒 **Protected Content** - Users can only edit/delete their own writings
- 🎭 **Multiple Categories** - Organize content as Shayari, Writing, or Feeling
- ❤️ **Like System** - Visitors can like writings
- 💬 **Comments** - Anyone can comment on writings
- 🗑️ **Admin Moderation** - Admin can delete inappropriate comments
- ⚡ **Content Approval** - Admin approval system for user submissions
- ✍️ **Easy Content Management** - Add, edit, and delete your writings with ease
- 🎬 **Smooth Animations** - Powered by Framer Motion for delightful interactions
- 💾 **File-based Storage** - Simple JSON file storage (easily upgradable to database)
- 🎯 **Category Filters** - Filter content by category on the home page
- 🌙 **Dark Theme** - Beautiful purple and pink gradient background

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd shayari-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Creating an Account

1. Visit http://localhost:3000/signup
2. Fill in your name, email, and password
3. Click "Create Account"
4. You'll be automatically logged in!

### Logging In

1. Visit http://localhost:3000/login
2. Enter your email and password
3. Click "Sign In"

### Viewing Writings

- Visit the home page to see all published writings from all users
- Use category filters to view specific types of content (All, Shayari, Writing, Feeling)
- Each card displays the content, category, date, and author (if provided)

### Adding New Content

1. Make sure you're logged in
2. Click the "Add Writing" button in the header (or visit /admin)
3. Select a category (Shayari, Writing, or Feeling)
4. Fill in the form:
   - **Title** (optional) - Give your writing a title
   - **Content** (required) - Your actual writing/shayari
   - **Author** (optional) - Your name or pen name
5. Click "Publish" to add it to your collection

### Managing Your Content

- All YOUR writings appear in the "Manage Your Writings" section on the admin page
- **Edit** - Click the edit icon to modify any of your writings
- **Delete** - Click the delete icon to remove a writing (with confirmation)
- **Note:** You can only edit/delete writings you created

## 🛠️ Technology Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Authentication:** NextAuth.js
- **Security:** bcrypt (password hashing)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** React Icons
- **Storage:** File-based JSON (upgradable to any database)

## 📁 Project Structure

```
shayari-platform/
├── app/
│   ├── admin/                  # Admin page (protected)
│   ├── api/
│   │   ├── auth/              # NextAuth API routes
│   │   ├── signup/            # User registration
│   │   └── writings/          # Writing CRUD operations
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── Header.tsx             # Navigation with auth status
│   ├── SessionProvider.tsx    # Auth session provider
│   └── WritingCard.tsx        # Writing display card
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   └── users.ts               # User management
├── types/
│   ├── index.ts               # Type definitions
│   └── next-auth.d.ts         # NextAuth types
├── data/
│   ├── writings.json          # Writings data
│   └── users.json             # Users data
├── .env.local                 # Environment variables
└── package.json
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to change the color scheme:

```js
colors: {
  primary: '#8B5CF6',    // Purple
  secondary: '#EC4899',   // Pink
}
```

### Background Gradient

Modify the gradient in `app/globals.css`:

```css
background: linear-gradient(
  135deg,
  rgb(15, 23, 42),      /* Start color */
  rgb(88, 28, 135)      /* End color */
);
```

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. **Add Environment Variables:**
   - `NEXTAUTH_URL`: Your production URL (e.g., https://yourapp.vercel.app)
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
5. Deploy!

### Build for Production

```bash
npm run build
npm start
```

## 📝 Documentation

- **README.md** - This file (general overview)
- **AUTHENTICATION_GUIDE.md** - Complete authentication documentation
- **AUTHENTICATION_SUMMARY.md** - Quick authentication reference
- **PROJECT_STATUS.md** - Original project completion report

## 📝 Future Enhancements

- 🔄 Password reset functionality
- 🌐 OAuth providers (Google, GitHub, etc.)
- 💬 Comments and reactions
- 🔍 Search functionality
- 📤 Share on social media
- 💾 Database integration (PostgreSQL, MongoDB, etc.)
- 🎨 Theme customization options
- 📊 Analytics dashboard
- 📧 Email verification

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📄 License

This project is open source and available for personal and commercial use.

## 💖 Support

If you like this project, please give it a ⭐ on GitHub!

---

Made with ❤️ for poetry and writing enthusiasts

