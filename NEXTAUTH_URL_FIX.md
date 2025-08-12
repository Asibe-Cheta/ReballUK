# Fix for Google OAuth on Port 3002

## The Issue
Your app is running on port 3002, but your Google OAuth redirect URI is probably configured for port 3000.

## Quick Fix Options:

### Option 1: Update .env.local (Recommended)
Add this line to your `.env.local` file:
```
NEXTAUTH_URL=http://localhost:3002
```

### Option 2: Update Google Console
1. Go to https://console.cloud.google.com/
2. Select your project
3. Go to APIs & Services > Credentials
4. Edit your OAuth 2.0 Client ID
5. Add this authorized redirect URI:
   ```
   http://localhost:3002/api/auth/callback/google
   ```

### Option 3: Force Port 3000
In package.json, change:
```json
"dev": "next dev --turbopack --port 3000"
```

## Test After Fix:
1. Restart your dev server
2. Try Google OAuth again
3. Should work properly
