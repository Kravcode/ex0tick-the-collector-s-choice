import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { LogOut, ShoppingBag, Store, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/marketplace")}>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Browse
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/seller-dashboard")}>
                <Store className="w-4 h-4 mr-2" />
                Sell
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/buyer-dashboard")}>
                <UserIcon className="w-4 h-4 mr-2" />
                My Holds
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/marketplace")}>
                Browse
              </Button>
              <Button variant="default" size="sm" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
