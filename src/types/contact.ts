import { z } from "zod";

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters"),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
      message: "Please enter a valid phone number",
    }),
  trainingInterest: z
    .string()
    .min(1, "Please select your training interest"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Training interest options
export const trainingInterests = [
  { value: "1v1-attacking", label: "1v1 Attacking Finishing" },
  { value: "1v1-keeper", label: "1v1 with Keeper" },
  { value: "1v1-crossing", label: "1v1 Attacking Crossing" },
  { value: "sisw-analysis", label: "SISW Analysis" },
  { value: "tav-breakdowns", label: "TAV Breakdowns" },
  { value: "general-training", label: "General Training Program" },
  { value: "academy-program", label: "REBALL Academy Program" },
  { value: "other", label: "Other" },
] as const;

// About page interfaces
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  email?: string;
  linkedin?: string;
}

export interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// Contact information interface
export interface ContactInfo {
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  businessHours: {
    weekdays: string;
    weekends: string;
  };
}
