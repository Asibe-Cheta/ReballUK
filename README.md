# REBALL - Professional Football Training Platform

A specialized football training platform built with Next.js 15, focusing on 1v1 scenario training with advanced video analysis features including SISW (Session in Slow-motion with Voiceover) and TAV (Technical Analysis Videos).

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom REBALL color palette
- **UI Components**: Shadcn/UI
- **Authentication**: NextAuth v5 (beta)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Fonts**: Permanent Marker (display) + Poppins (body)

## 🎨 Design System

### Monochromatic Color Palette
- **Pure Black**: Primary brand color (#000000)
- **Pure White**: Background and contrast (#FFFFFF)
- **Charcoal**: Dark elements (#0A0A0A)
- **Dark Gray**: Secondary elements (#1A1A1A)
- **Text Gray**: Body text (#737373)
- **Light Gray**: Subtle backgrounds (#F5F5F5)
- **Medium Gray**: Borders and dividers (#CCCCCC)
- **Border Gray**: Form inputs (#E5E5E5)

### Visual Effects
- **Glassmorphism**: Professional frosted glass effects with 20px backdrop blur
- **Monochromatic Design**: Clean, professional aesthetic inspired by diabrowser.com
- **Smooth Transitions**: Hover effects and animations
- **Responsive Design**: Mobile-first approach

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── dashboard/
│   │   ├── training/
│   │   ├── 1v1-scenarios/
│   │   ├── video-analysis/
│   │   └── progress/
│   ├── about/
│   ├── contact/
│   ├── globals.css        # Global styles with REBALL theme
│   ├── layout.tsx         # Root layout with navbar
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # Shadcn/UI components
│   ├── forms/            # Form components
│   ├── navigation/       # Navigation components
│   ├── training/         # Training-specific components
│   ├── dashboard/        # Dashboard components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── contexts/             # React contexts
├── store/                # State management
└── constants/            # App constants
```

## 🔧 Environment Variables

The following environment variables are configured:

### Database (Supabase)
- `DATABASE_URL` - Pooled database connection
- `DIRECT_URL` - Direct database connection
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anon key

### Authentication (NextAuth v5)
- `NEXTAUTH_SECRET` - Secret for JWT signing
- `NEXTAUTH_URL` - Application URL

### Google OAuth
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Email Service (SendGrid)
- `SENDGRID_API_KEY` - SendGrid API key
- `SENDGRID_FROM_EMAIL` - Sender email address

### File Storage (Cloudinary)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Public cloud name

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Features Implemented

- ✅ Next.js 15 with App Router and TypeScript
- ✅ Shadcn/UI with monochromatic REBALL color palette
- ✅ Tailwind CSS with professional glassmorphism effects
- ✅ Google Fonts (Permanent Marker + Poppins)
- ✅ Training-focused navigation and homepage
- ✅ SISW (Session in Slow-motion with Voiceover) component
- ✅ TAV (Technical Analysis Videos) component
- ✅ Proper route group structure (auth/dashboard)
- ✅ Environment variables configuration
- ✅ NO pricing display on homepage (per business rules)

## 🔜 Next Steps

- Set up Prisma database schema for training data
- Implement authentication with NextAuth v5
- Create 1v1 scenario training interfaces
- Add confidence rating tracking system
- Implement video upload and analysis
- Support all player positions (Strikers, Wingers, CAM, Full-backs)
- Add Group and individual training session types

## 🤝 Contributing

This is a foundational setup for the REBALL professional football training platform. The architecture follows strict REBALL rules for code quality, security, performance, and maintainability to build a professional, scalable training platform.