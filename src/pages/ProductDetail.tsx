import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Clock, ShieldCheck, User } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  condition: string;
  rarity: string | null;
  status: string;
  verification_status: string;
  verification_notes: string | null;
  photos: string[];
  seller_id: string;
  created_at: string;
}

interface Hold {
  id: string;
  hold_expires_at: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [hold, setHold] = useState<Hold | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (hold) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const expiry = new Date(hold.hold_expires_at).getTime();
        const diff = expiry - now;

        if (diff <= 0) {
          setTimeRemaining("Expired");
          setHold(null);
          fetchProduct();
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [hold]);

  const fetchProduct = async () => {
    if (!id) return;

    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (!productError && productData) {
      setProduct(productData);

      // Check if there's an active hold
      if (productData.status === "on_hold") {
        const { data: holdData } = await supabase
          .from("holds")
          .select("*")
          .eq("product_id", id)
          .single();

        if (holdData) {
          setHold(holdData);
        }
      }
    }

    setLoading(false);
  };

  const handleHold = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { error: holdError } = await supabase.from("holds").insert({
      product_id: id,
      buyer_id: user.id,
      hold_expires_at: expiresAt.toISOString(),
    });

    if (holdError) {
      toast({
        title: "Error",
        description: holdError.message,
        variant: "destructive",
      });
      return;
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({ status: "on_hold" })
      .eq("id", id);

    if (!updateError) {
      toast({
        title: "Success!",
        description: "Item reserved for 24 hours",
      });
      fetchProduct();
    }
  };

  const handleCancelHold = async () => {
    if (!hold) return;

    const { error: deleteError } = await supabase.from("holds").delete().eq("id", hold.id);

    if (deleteError) {
      toast({
        title: "Error",
        description: deleteError.message,
        variant: "destructive",
      });
      return;
    }

    const { error: updateError } = await supabase
      .from("products")
      .update({ status: "available" })
      .eq("id", id);

    if (!updateError) {
      toast({
        title: "Hold cancelled",
        description: "Item is now available again",
      });
      setHold(null);
      fetchProduct();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  const isOwnProduct = user && product.seller_id === user.id;
  const isHeldByUser = user && hold && product.seller_id !== user.id;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-xl overflow-hidden border border-border shadow-card">
              {product.photos && product.photos[0] ? (
                <img
                  src={product.photos[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-3">
                {product.verification_status === "verified" && (
                  <Badge className="bg-verified">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge variant="secondary" className="capitalize">
                  {product.condition.replace("_", " ")}
                </Badge>
                {product.rarity && (
                  <Badge variant="outline" className="capitalize">
                    {product.rarity.replace("_", " ")}
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
              <p className="text-3xl font-bold text-primary mb-4">${product.price}</p>
              <p className="text-muted-foreground mb-6">{product.description}</p>
            </div>

            {/* Status Card */}
            {product.status === "on_hold" && hold && (
              <Card className="bg-onHold/10 border-onHold">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-onHold" />
                    <span className="font-semibold">Item On Hold</span>
                  </div>
                  {isHeldByUser && (
                    <p className="text-sm text-muted-foreground mb-2">
                      Time remaining: <span className="font-mono font-bold">{timeRemaining}</span>
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {product.status === "available" && !isOwnProduct && (
                <Button size="lg" className="w-full shadow-glow" onClick={handleHold}>
                  <Clock className="w-5 h-5 mr-2" />
                  Hold for 24 Hours
                </Button>
              )}

              {isHeldByUser && (
                <>
                  <Button size="lg" className="w-full" variant="default">
                    Buy Now
                  </Button>
                  <Button
                    size="lg"
                    className="w-full"
                    variant="outline"
                    onClick={handleCancelHold}
                  >
                    Cancel Hold
                  </Button>
                </>
              )}

              {isOwnProduct && (
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">This is your listing</p>
                </div>
              )}
            </div>

            {/* Details */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium capitalize">
                    {product.category.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Condition</span>
                  <span className="font-medium capitalize">
                    {product.condition.replace("_", " ")}
                  </span>
                </div>
                {product.verification_notes && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Verification Notes</p>
                    <p className="text-sm">{product.verification_notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
