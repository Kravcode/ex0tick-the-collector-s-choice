import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Search, ShieldCheck, Clock } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  rarity: string | null;
  status: string;
  verification_status: string;
  photos: string[];
}

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from("products").select("*").eq("status", "available");

    if (categoryFilter !== "all") {
      query = query.eq("category", categoryFilter);
    }

    const { data, error } = await query;

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRarityColor = (rarity: string | null) => {
    switch (rarity) {
      case "ultra_rare":
        return "bg-primary";
      case "rare":
        return "bg-secondary";
      case "uncommon":
        return "bg-accent";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search collectibles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="drinks">Drinks</SelectItem>
                <SelectItem value="hot_wheels">Hot Wheels</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
                <SelectItem value="merch">Merch</SelectItem>
                <SelectItem value="collectibles">Collectibles</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-glow transition-all cursor-pointer group border-border shadow-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {product.photos && product.photos[0] ? (
                    <img
                      src={product.photos[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      📦
                    </div>
                  )}
                  {product.verification_status === "verified" && (
                    <div className="absolute top-2 right-2 bg-verified rounded-full p-1.5">
                      <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {product.rarity && (
                    <Badge className={`absolute top-2 left-2 ${getRarityColor(product.rarity)}`}>
                      {product.rarity.replace("_", " ")}
                    </Badge>
                  )}
                </div>

                <CardContent className="pt-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Badge variant="secondary" className="capitalize">
                      {product.condition.replace("_", " ")}
                    </Badge>
                    <span className="capitalize">{product.category.replace("_", " ")}</span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0 flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary">${product.price}</p>
                  </div>
                  <Button size="sm" className="group-hover:shadow-glow">
                    View
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
