# Cloudinary Setup Guide

## Error Fix: "Failed to get upload signature"

The video upload feature is currently failing because Cloudinary environment variables are not configured. Follow these steps to fix this:

## 1. Create Cloudinary Account

1. Go to [Cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After registration, you'll get your dashboard with credentials

## 2. Get Your Cloudinary Credentials

In your Cloudinary dashboard, you'll find:
- **Cloud Name** (e.g., `my-cloud-name`)
- **API Key** (e.g., `123456789012345`)
- **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz`)

## 3. Set Environment Variables

Create a `.env.local` file in your project root (if it doesn't exist) and add:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
```

**Replace the values with your actual Cloudinary credentials.**

## 4. Restart Development Server

After adding the environment variables:

```bash
npm run dev
```

## 5. Test Video Upload

The video upload feature should now work properly. You can:
- Upload training session videos
- Use SISW (Session in Slow-motion with Voiceover) analysis
- Create TAV (Technical Analysis Videos) breakdowns

## Troubleshooting

If you still get errors:

1. **Check environment variables**: Make sure all 4 Cloudinary variables are set
2. **Restart server**: Environment variables require a server restart
3. **Check Cloudinary dashboard**: Verify your credentials are correct
4. **Check browser console**: Look for any additional error messages

## Security Note

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- Keep your API secret secure and don't share it publicly

## Free Tier Limits

Cloudinary's free tier includes:
- 25 GB storage
- 25 GB bandwidth per month
- Basic transformations
- Perfect for testing and small projects
