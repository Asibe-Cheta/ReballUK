# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Database Configuration
```bash
# Get these from your Supabase project settings
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"
DIRECT_URL="postgresql://username:password@host:port/database"
```

### NextAuth Configuration
```bash
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your_secret_key_here_minimum_32_characters"
```

### Google OAuth Configuration (Optional)
```bash
# Get these from Google Cloud Console: https://console.cloud.google.com/
GOOGLE_CLIENT_ID="your_google_client_id_here"
GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
```

## Setting Up Google OAuth

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create or select a project**
3. **Enable APIs**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" or "Google Identity API"
   - Click "Enable"
4. **Create OAuth Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:3001/api/auth/callback/google`
   - Copy the Client ID and Client Secret

## For Testing Without Google OAuth

If you don't want to set up Google OAuth right now, you can:

1. **Use Email/Password Authentication**: 
   - The registration and login forms now support email/password
   - Create an account with any email and password
   - This works without Google OAuth setup

2. **Temporarily Disable Google Provider**:
   - Comment out the Google provider in `src/lib/auth-config.ts`
   - Remove the Google button from login/register forms

## Environment Setup Steps

1. **Copy the template**:
   ```bash
   cp .env.example .env.local  # If .env.example exists
   # Or create .env.local manually
   ```

2. **Add your database credentials**:
   - Get these from your Supabase project dashboard
   - Database settings > Connection string

3. **Generate NextAuth secret**:
   ```bash
   openssl rand -base64 32
   # Or use any 32+ character random string
   ```

4. **Add Google OAuth credentials** (optional):
   - Follow the Google OAuth setup guide above
   - Or skip this step to use email/password only

5. **Restart your development server**:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Google OAuth "redirect_uri_mismatch" Error
- Make sure your redirect URI in Google Console exactly matches: `http://localhost:3001/api/auth/callback/google`
- Check that NEXTAUTH_URL matches your development server URL
- Restart the development server after environment changes

### Database Connection Issues
- Verify your DATABASE_URL and DIRECT_URL are correct
- Check that your Supabase project is running
- Ensure your IP is whitelisted in Supabase if using connection pooling

### Email Registration Not Working
- Check that all environment variables are set
- Verify database connection
- Check browser console for any error messages

## Production Setup

For production deployment:
- Use production URLs for NEXTAUTH_URL and redirect URIs
- Generate a new, secure NEXTAUTH_SECRET
- Use production database credentials
- Set up proper domain verification for Google OAuth
