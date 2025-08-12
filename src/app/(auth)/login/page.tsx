"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import AuthCard from "@/components/auth/auth-card";
import OAuthButton from "@/components/auth/oauth-button";
import PasswordInput from "@/components/auth/password-input";
import { LoginFormData, loginFormSchema } from "@/types/auth";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const searchParams = useSearchParams();
  const { login, isAuthenticated, redirectToDashboard } = useAuth();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle authentication errors from URL params
  useEffect(() => {
    if (error) {
      toast.error("Authentication failed", {
        description: getErrorMessage(error),
      });
    }
  }, [error]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      redirectToDashboard();
    }
  }, [isAuthenticated, redirectToDashboard]);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "OAuthSignin":
        return "Error occurred during OAuth sign-in.";
      case "OAuthCallback":
        return "Error occurred during OAuth callback.";
      case "OAuthCreateAccount":
        return "Could not create OAuth account.";
      case "EmailCreateAccount":
        return "Could not create account with email.";
      case "Callback":
        return "Error occurred during callback.";
      case "OAuthAccountNotLinked":
        return "OAuth account is not linked to an existing account.";
      case "EmailSignin":
        return "Error occurred during email sign-in.";
      case "CredentialsSignin":
        return "Invalid credentials provided.";
      case "SessionRequired":
        return "Please sign in to access this page.";
      default:
        return "An authentication error occurred.";
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login("credentials", callbackUrl, {
        email: data.email,
        password: data.password
      })
      
      if (!result.success) {
        form.setError("root", {
          type: "manual",
          message: result.error === "CredentialsSignin" 
            ? "Invalid email or password" 
            : "Login failed"
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      form.setError("root", {
        type: "manual",
        message: "Login failed. Please try again."
      })
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await login("google", callbackUrl);
      
      if (!result.success) {
        throw new Error(result.error || "Google sign-in failed");
      }
      
    } catch (error) {
      console.error("Google sign-in error:", error);
      // Error handling is done in the useAuth hook
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome Back" 
      subtitle="Sign in to your REBALL account"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Remember me
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <Link 
              href="/forgot-password" 
              className="text-sm text-pure-black dark:text-pure-white hover:opacity-70 transition-opacity"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <Button 
            type="submit" 
            className="w-full h-12" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
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
          onSignIn={async () => await handleGoogleSignIn()}
        />

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-text-gray dark:text-medium-gray">
          Don&apos;t have an account?{" "}
          <Link 
            href="/register" 
            className="font-medium text-pure-black dark:text-pure-white hover:opacity-70 transition-opacity"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
