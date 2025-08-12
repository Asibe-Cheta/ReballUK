import { AuthCardProps } from "@/types/auth";

export default function AuthCard({ title, subtitle, children, className = "" }: AuthCardProps) {
  return (
    <div className={`glow-card p-8 w-full max-w-md mx-auto ${className}`} data-card="auth">
      <span className="glow"></span>
      <div className="text-center mb-8">
        <h1 className="font-marker text-3xl mb-2">{title}</h1>
        {subtitle && (
          <p className="text-text-gray dark:text-medium-gray">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}
