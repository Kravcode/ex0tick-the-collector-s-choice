import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Badge, ShoppingBag, Shield, Clock } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Drinks", icon: "🥤", count: "50+" },
    { name: "Hot Wheels", icon: "🏎️", count: "100+" },
    { name: "Snacks", icon: "🍿", count: "75+" },
    { name: "Merch", icon: "👕", count: "40+" },
    { name: "Collectibles", icon: "🎮", count: "200+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Discover Rare
              </span>
              <br />
              <span className="text-foreground">Collectibles</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Buy, sell, and hold exotic items. Monster, Red Bull, Hot Wheels, limited merch, and more.
              Reserve for 24 hours before you buy.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="shadow-glow" onClick={() => navigate("/marketplace")}>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Browse Marketplace
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Ex0tick?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-xl border border-border shadow-card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">24-Hour Holds</h3>
            <p className="text-muted-foreground">
              Reserve items for 24 hours to secure your purchase without commitment
            </p>
          </div>

          <div className="bg-card p-8 rounded-xl border border-border shadow-card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Verified Authentic</h3>
            <p className="text-muted-foreground">
              Every premium listing is verified for authenticity and fair pricing
            </p>
          </div>

          <div className="bg-card p-8 rounded-xl border border-border shadow-card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Badge className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Rare Finds</h3>
            <p className="text-muted-foreground">
              Discover limited-edition items you won't find anywhere else
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate("/marketplace")}
                className="bg-card hover:bg-card/80 p-6 rounded-xl border border-border shadow-card transition-all hover:shadow-glow hover:scale-105"
              >
                <div className="text-5xl mb-3">{category.icon}</div>
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} items</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="bg-gradient-primary rounded-2xl p-12 text-center shadow-premium">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Start Collecting?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of collectors buying and selling rare items
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
            Create Account
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
