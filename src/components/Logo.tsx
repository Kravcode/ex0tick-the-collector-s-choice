import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-1 group">
      <span className="text-3xl font-bold bg-gradient-neon bg-clip-text text-transparent tracking-tight">
        Ex0
      </span>
      <div className="relative">
        <Check className="w-7 h-7 text-primary animate-pulse" strokeWidth={3} />
        <Check className="w-7 h-7 text-neon-cyan absolute top-0 left-0 opacity-50 blur-sm" strokeWidth={3} />
      </div>
      <span className="text-3xl font-bold bg-gradient-neon bg-clip-text text-transparent tracking-tight">
        ick
      </span>
    </Link>
  );
};

export default Logo;
