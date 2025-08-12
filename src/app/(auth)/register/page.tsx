"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import AuthCard from "@/components/auth/auth-card";
import OAuthButton from "@/components/auth/oauth-button";
import PasswordInput from "@/components/auth/password-input";
import PasswordStrengthIndicator from "@/components/auth/password-strength";
import { RegisterFormData, registerFormSchema, PLAYER_POSITIONS } from "@/types/auth";
import { useAuth } from "@/hooks/use-auth";
import FormDebugger from "@/components/debug/form-debugger";

const positionLabels = {
  STRIKER: "Striker",
  WINGER: "Winger", 
  CAM: "CAM (Central Attacking Midfielder)",
  FULLBACK: "Full-back",
  MIDFIELDER: "Midfielder",
  DEFENDER: "Defender",
  GOALKEEPER: "Goalkeeper",
  OTHER: "Other / Not Sure",
};

export default function RegisterPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const searchParams = useSearchParams();
  const { login, isAuthenticated, redirectToDashboard } = useAuth();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      position: undefined,
      agreeToTerms: false,
      agreeToPrivacy: false,
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      redirectToDashboard();
    }
  }, [isAuthenticated, redirectToDashboard]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log("Form data being submitted:", data)
      
      // Register user with email/password
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Account created successfully!", {
          description: "You can now sign in with your credentials.",
        })
        
        // Automatically sign in the user with credentials
        const signInResult = await login("credentials", callbackUrl, {
          email: data.email,
          password: data.password
        })
        
        if (!signInResult.success) {
          // If auto sign-in fails, redirect to login with email pre-filled
          const loginUrl = `/login?email=${encodeURIComponent(data.email)}&message=account-created`
          window.location.href = loginUrl
        }
      } else {
        form.setError("root", {
          type: "manual",
          message: result.error || "Registration failed"
        })
        
        if (result.field) {
          form.setError(result.field as keyof RegisterFormData, {
            type: "manual",
            message: result.error
          })
        }
        
        toast.error("Registration failed", {
          description: result.error || "Please check your information and try again.",
        })
      }
    } catch (error) {
      console.error("Registration error:", error)
      form.setError("root", {
        type: "manual",
        message: "Registration failed. Please try again."
      })
      toast.error("Registration failed", {
        description: "Please try again or contact support if the problem persists.",
      })
    }
  };

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await login("google", callbackUrl);
      
      if (!result.success) {
        throw new Error(result.error || "Google sign-up failed");
      }
      
    } catch (error) {
      console.error("Google sign-up error:", error);
      // Error handling is done in the useAuth hook
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Join REBALL" 
      subtitle="Create your account and start training"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your full name" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="your.email@example.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Player Position */}
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Playing Position</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PLAYER_POSITIONS.map((position) => (
                      <SelectItem key={position} value={position}>
                        {positionLabels[position]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Create a strong password"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setPasswordValue(value);
                    }}
                  />
                </FormControl>
                <PasswordStrengthIndicator password={passwordValue} />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Confirm your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Terms & Privacy Agreements */}
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      I agree to the{" "}
                      <Link 
                        href="/terms" 
                        className="text-pure-black dark:text-pure-white hover:opacity-70 transition-opacity underline"
                        target="_blank"
                      >
                        Terms of Service
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="agreeToPrivacy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      I agree to the{" "}
                      <Link 
                        href="/privacy" 
                        className="text-pure-black dark:text-pure-white hover:opacity-70 transition-opacity underline"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Create Account Button */}
          <Button 
            type="submit" 
            className="w-full h-12" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-text-gray dark:text-medium-gray">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google OAuth */}
      <OAuthButton
        provider="google" 
        isLoading={isGoogleLoading}
        onSignIn={async () => await handleGoogleSignUp()}
      />

      {/* Sign In Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-text-gray dark:text-medium-gray">
          Already have an account?{" "}
          <Link 
            href="/login" 
            className="font-medium text-pure-black dark:text-pure-white hover:opacity-70 transition-opacity"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
    <FormDebugger />
  );
}
