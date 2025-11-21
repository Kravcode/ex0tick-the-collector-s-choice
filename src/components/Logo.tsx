import { Check } from "lucide-react";

interface LogoProps {
  className?: string;
  showIcon?: boolean;
}

export const Logo = ({ className = "", showIcon = true }: LogoProps) => {
  return (
    <div className={`flex items-center gap-1 font-bold text-2xl ${className}`}>
      <span className="bg-gradient-primary bg-clip-text text-transparent">Ex</span>
      {showIcon && <Check className="w-6 h-6 text-primary" strokeWidth={3} />}
      <span className="bg-gradient-primary bg-clip-text text-transparent">tick</span>
    </div>
  );
};
