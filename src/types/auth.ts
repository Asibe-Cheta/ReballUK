import { z } from "zod";

// Player position options
export const PLAYER_POSITIONS = [
  "STRIKER",
  "WINGER", 
  "CAM",
  "FULLBACK",
  "MIDFIELDER",
  "DEFENDER",
  "GOALKEEPER",
  "OTHER"
] as const;

export type PlayerPosition = typeof PLAYER_POSITIONS[number];

// Login form schema and types
export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  rememberMe: z.boolean().default(false),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Registration form schema and types
export const registerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name must not exceed 50 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
  confirmPassword: z.string(),
  position: z.enum(PLAYER_POSITIONS, {
    required_error: "Please select your preferred playing position.",
  }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms of service.",
  }),
  agreeToPrivacy: z.boolean().refine(val => val === true, {
    message: "You must agree to the privacy policy.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;

// Auth state and error types
export interface AuthError {
  message: string;
  field?: string;
}

export interface AuthState {
  isLoading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
}

// OAuth provider types
export type OAuthProvider = "google" | "github";

export interface OAuthButtonProps {
  provider: OAuthProvider;
  isLoading?: boolean;
  onClick: () => void;
  className?: string;
}

// Password strength types
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isLongEnough: boolean;
}

// Auth component props
export interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export interface FormFieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}
