// Environment variable checker
console.log("=== REBALL Environment Check ===");
console.log("Current environment variables:");
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "❌ NOT SET");
console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "✅ SET" : "❌ NOT SET");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✅ SET" : "❌ NOT SET");
console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✅ SET" : "❌ NOT SET");
console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ SET" : "❌ NOT SET");
console.log("");

if (!process.env.NEXTAUTH_URL) {
  console.log("🔧 FIX NEEDED: Add this to your .env.local file:");
  console.log("NEXTAUTH_URL=http://localhost:3002");
  console.log("");
}

if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.includes("3002")) {
  console.log("🔧 FIX NEEDED: Update NEXTAUTH_URL in .env.local to:");
  console.log("NEXTAUTH_URL=http://localhost:3002");
  console.log("");
}

console.log("🎯 For Google OAuth to work:");
console.log("1. Make sure your Google Console redirect URI is: http://localhost:3002/api/auth/callback/google");
console.log("2. Or force the app to run on port 3000 if that's what your Google Console is configured for");
console.log("");
