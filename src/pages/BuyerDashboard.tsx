import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Clock, ShoppingBag } from "lucide-react";

interface Hold {
  id: string;
  hold_expires_at: string;
  product_id: string;
  products: {
    title: string;
    price: number;
    photos: string[];
  };
}

interface Order {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  products: {
    title: string;
    photos: string[];
  };
}

const BuyerDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [holds, setHolds] = useState<Hold[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchHolds(session.user.id);
        fetchOrders(session.user.id);
      }
    });
  }, [navigate]);

  const fetchHolds = async (userId: string) => {
    const { data, error } = await supabase
      .from("holds")
      .select(`
        *,
        products (
          title,
          price,
          photos
        )
      `)
      .eq("buyer_id", userId);

    if (!error && data) {
      // Filter out expired holds
      const activeHolds = data.filter((hold) => new Date(hold.hold_expires_at) > new Date());
      setHolds(activeHolds as any);
    }
  };

  const fetchOrders = async (userId: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        products (
          title,
          photos
        )
      `)
      .eq("buyer_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as any);
    }
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>

          {/* Active Holds */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Active Holds ({holds.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {holds.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No active holds. Browse the marketplace to reserve items!
                </p>
              ) : (
                <div className="space-y-4">
                  {holds.map((hold) => (
                    <div
                      key={hold.id}
                      className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {hold.products.photos && hold.products.photos[0] ? (
                          <img
                            src={hold.products.photos[0]}
                            alt={hold.products.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            📦
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold">{hold.products.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${hold.products.price} • Expires in {getTimeRemaining(hold.hold_expires_at)}
                        </p>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => navigate(`/product/${hold.product_id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                My Orders ({orders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No orders yet. Start shopping!
                </p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center gap-4 p-4 border border-border rounded-lg"
                    >
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {order.products.photos && order.products.photos[0] ? (
                          <img
                            src={order.products.photos[0]}
                            alt={order.products.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            📦
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold">{order.products.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${order.amount} • {order.status}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
