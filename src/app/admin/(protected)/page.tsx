"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Users, DollarSign, Activity, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0, activeNow: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const ordersSnap = await getDocs(collection(db, "orders"));
        const productsSnap = await getDocs(collection(db, "products"));
        
        let totalRev = 0;
        ordersSnap.forEach(doc => {
          totalRev += doc.data().totalAmount || 0;
        });

        setStats({
          revenue: totalRev,
          orders: ordersSnap.size,
          customers: 0, // Placeholder until users are implemented
          activeNow: productsSnap.size, // Showing total products instead
        });

        const recentQ = query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5));
        const recentSnap = await getDocs(recentQ);
        setRecentOrders(recentSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{stats.revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{stats.orders}</div>
                <p className="text-xs text-muted-foreground">Lifetime orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeNow}</div>
                <p className="text-xs text-muted-foreground">Active in catalog</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{stats.customers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {recentOrders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No recent orders found.</p>
                  ) : recentOrders.map(order => (
                    <div key={order.id} className="flex items-center">
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{order.customerInfo?.name || "Guest"}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customerInfo?.email || "No email"}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        +₦{(order.totalAmount || 0).toLocaleString()}
                        <Badge className="ml-3" variant="outline">{order.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
