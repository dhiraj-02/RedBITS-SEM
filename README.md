# RedBITS

RedBITS is a Reddit-style social platform exclusively for BITS Pilani email holders, built using Next.js. It features Google OAuth for authentication, caching with Upstash Redis, a MySQL database on AWS, and media uploads with Cloudinary. The project is styled with Tailwind CSS and deployed on Vercel.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)

---

## Features
- **Authentication**: Sign in with Google (BITS Pilani emails only).
- **Post Creation**: Create and share posts with media support.
- **Upvote/Downvote System**: Similar to Reddit, interact with posts through voting.
- **DM's**: Direct messaging to any user using username.
- **Caching**: Optimized with Upstash Redis for faster load times.
- **Media Uploads**: Images are stored via Cloudinary.
- **Responsive Design**: Styled with Tailwind CSS for mobile and desktop compatibility.

---

## Tech Stack
- **Frontend**: [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: Google OAuth, restricted to BITS Pilani emails
- **Backend**: Next.js API Routes
- **Database**: MySQL hosted on AWS
- **Caching**: Redis (Upstash)
- **Media Storage**: Cloudinary
- **Deployment**: Vercel

---

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL (AWS RDS)
- Redis (Upstash)
- Cloudinary account for media storage

### 1. Clone the Repository
```bash
git clone https://github.com/dhiraj-02/RedBITS-SEM.git
cd RedBITS-SEM
```
### 2. Install dependencies
```bash
npm install
```

### 3. Setup .env file
```
# Database
DATABASE_URL=mysql://username:password@host:port/database

# NextAuth
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Upstash Redis
REDIS_URL=your-upstash-redis-url
REDIS_SECRET=your-upstash-redis-secret

# Cloudinary
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

```

### 4. Start dev server
```bash
npm run dev
```
