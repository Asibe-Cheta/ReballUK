"use client";

import { PasswordStrength } from "@/types/auth";
import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

function calculatePasswordStrength(password: string): PasswordStrength {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const isLongEnough = password.length >= 8;

  const checks = [hasUppercase, hasLowercase, hasNumber, hasSpecialChar, isLongEnough];
  const score = checks.filter(Boolean).length;

  const feedback = [];
  if (!isLongEnough) feedback.push("At least 8 characters");
  if (!hasUppercase) feedback.push("One uppercase letter");
  if (!hasLowercase) feedback.push("One lowercase letter");
  if (!hasNumber) feedback.push("One number");
  if (!hasSpecialChar) feedback.push("One special character");

  return {
    score,
    feedback,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    isLongEnough,
  };
}

const strengthColors = {
  0: "bg-red-500",
  1: "bg-red-500",
  2: "bg-orange-500",
  3: "bg-yellow-500",
  4: "bg-green-500",
  5: "bg-green-600",
};

const strengthLabels = {
  0: "Very Weak",
  1: "Weak", 
  2: "Fair",
  3: "Good",
  4: "Strong",
  5: "Very Strong",
};

export default function PasswordStrengthIndicator({ 
  password, 
  className = "" 
}: PasswordStrengthProps) {
  if (!password) return null;

  const strength = calculatePasswordStrength(password);

  return (
    <div className={`mt-3 ${className}`}>
      {/* Strength Bar */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthColors[strength.score]}`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-text-gray dark:text-medium-gray">
          {strengthLabels[strength.score]}
        </span>
      </div>

      {/* Requirements Checklist */}
      <div className="space-y-1">
        {[
          { label: "At least 8 characters", met: strength.isLongEnough },
          { label: "Uppercase letter", met: strength.hasUppercase },
          { label: "Lowercase letter", met: strength.hasLowercase },
          { label: "Number", met: strength.hasNumber },
          { label: "Special character", met: strength.hasSpecialChar },
        ].map((requirement, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            {requirement.met ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <X className="w-3 h-3 text-red-500" />
            )}
            <span className={requirement.met ? "text-green-600" : "text-text-gray dark:text-medium-gray"}>
              {requirement.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
