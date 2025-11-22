import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Zap, TrendingUp, Package, Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Sneakers", icon: "👟", path: "/marketplace?category=sneakers" },
    { name: "Drinks", icon: "🥤", path: "/marketplace?category=drinks" },
    { name: "Hot Wheels", icon: "🏎️", path: "/marketplace?category=hot_wheels" },
    { name: "Streetwear", icon: "👕", path: "/marketplace?category=streetwear" },
    { name: "Watches", icon: "⌚", path: "/marketplace?category=watches" },
    { name: "Electronics", icon: "📱", path: "/marketplace?category=electronics" },
    { name: "Trading Cards", icon: "🃏", path: "/marketplace?category=trading_cards" },
    { name: "Toys", icon: "🧸", path: "/marketplace?category=toys" },
    { name: "Snacks", icon: "🍿", path: "/marketplace?category=snacks" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-hero opacity-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 py-24 text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-2 rounded-full border border-primary/30 bg-card/50 backdrop-blur-sm">
            <span className="text-sm text-primary font-semibold">India's Exotic Marketplace — Verified & Trusted</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-neon bg-clip-text text-transparent">
            Discover Rare
            <br />
            Collectibles
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Buy, bid, and trade exotic items with confidence. Authentication guaranteed.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search sneakers, watches, collectibles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-card/50 backdrop-blur-sm border-border/50 focus:border-primary shadow-neon"
              />
            </div>
          </form>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate("/marketplace")} className="shadow-neon hover:shadow-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              Explore Marketplace
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")} className="border-primary/30 hover:bg-primary/10">
              Start Selling
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="text-center shadow-card hover:shadow-neon transition-all border-border/50 bg-gradient-card backdrop-blur-sm">
            <CardContent className="pt-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Verified Authentic</h3>
              <p className="text-sm text-muted-foreground">
                Expert authentication on every item
              </p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-card hover:shadow-neon transition-all border-border/50 bg-gradient-card backdrop-blur-sm">
            <CardContent className="pt-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-cyan/10 flex items-center justify-center">
                <Zap className="w-8 h-8 text-neon-cyan" />
              </div>
              <h3 className="font-bold text-lg mb-2">Bid & Ask</h3>
              <p className="text-sm text-muted-foreground">
                StockX-style market pricing
              </p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-card hover:shadow-neon transition-all border-border/50 bg-gradient-card backdrop-blur-sm">
            <CardContent className="pt-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-pink/10 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-neon-pink" />
              </div>
              <h3 className="font-bold text-lg mb-2">Price Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Real-time market data & history
              </p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-card hover:shadow-neon transition-all border-border/50 bg-gradient-card backdrop-blur-sm">
            <CardContent className="pt-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-green/10 flex items-center justify-center">
                <Package className="w-8 h-8 text-neon-green" />
              </div>
              <h3 className="font-bold text-lg mb-2">Secure Escrow</h3>
              <p className="text-sm text-muted-foreground">
                Protected transactions
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-20 bg-muted/5">
        <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-neon bg-clip-text text-transparent">
          Explore Categories
        </h2>
        <p className="text-center text-muted-foreground mb-12">Browse exotic collectibles from around the world</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Card
              key={category.name}
              className="cursor-pointer hover:shadow-neon hover:border-primary/50 transition-all group shadow-card border-border/50 bg-gradient-card backdrop-blur-sm"
              onClick={() => navigate(category.path)}
            >
              <CardContent className="pt-8 pb-6 text-center">
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <p className="font-bold text-sm">{category.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="shadow-premium border-primary/20 bg-gradient-card backdrop-blur-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-neon opacity-5"></div>
          <CardContent className="pt-12 pb-12 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Trading?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of collectors buying and selling exotic items in India's most trusted marketplace
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="shadow-neon hover:shadow-glow">
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
