import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("Invalid DATABASE_URL"),
  DIRECT_URL: z.string().url("Invalid DIRECT_URL"),
  
  // NextAuth
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().url("Invalid NEXTAUTH_URL").optional(),
  
  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // Email (Optional for now)
  SENDGRID_API_KEY: z.string().optional(),
  SENDGRID_FROM_EMAIL: z.string().email("Invalid SENDGRID_FROM_EMAIL").optional(),
  
  // Cloudinary (Optional for now)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  
  // Node Environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

type EnvSchema = z.infer<typeof envSchema>;

// Validate environment variables
export function validateEnv(): EnvSchema {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      
      console.error("❌ Invalid environment variables:");
      console.error(errorMessages.join("\n"));
      
      throw new Error(
        `Environment validation failed. Please check your .env.local file.\n${errorMessages.join("\n")}`
      );
    }
    
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Runtime environment check
export function checkAuthEnvironment() {
  const requiredVars = [
    "DATABASE_URL",
    "NEXTAUTH_SECRET", 
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET"
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error("❌ Missing required authentication environment variables:");
    console.error(missing.map(name => `  - ${name}`).join("\n"));
    
    return {
      isValid: false,
      missing,
      message: `Missing environment variables: ${missing.join(", ")}`
    };
  }
  
  console.log("✅ All authentication environment variables are configured");
  return {
    isValid: true,
    missing: [],
    message: "Environment variables are properly configured"
  };
}
