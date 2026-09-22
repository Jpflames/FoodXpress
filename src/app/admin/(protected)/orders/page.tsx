"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreHorizontal, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(docs);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case "confirmed": return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmed</Badge>;
      case "out_for_delivery": return <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Out for Delivery</Badge>;
      case "delivered": return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Delivered</Badge>;
      case "cancelled": return <Badge variant="destructive">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "successful": return <span className="text-emerald-600 font-medium">Paid</span>;
      case "pending": return <span className="text-amber-600 font-medium">Pending</span>;
      case "failed": return <span className="text-destructive font-medium">Failed</span>;
      default: return <span className="text-muted-foreground">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(search.toLowerCase()) || 
    (order.customerInfo?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">View and manage customer orders.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 w-full">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search orders or customers..." 
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Payment</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Total</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-10"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></td></tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">No orders found.</td></tr>
                  ) : filteredOrders.map((order) => {
                    // Compute total items and amount (mock or real)
                    const totalItems = order.items?.length || 0;
                    
                    return (
                      <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td className="p-4 align-middle font-medium">#{order.id.slice(-6).toUpperCase()}</td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium">{order.customerInfo?.name || "Guest User"}</span>
                            <span className="text-xs text-muted-foreground">{totalItems} items</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="p-4 align-middle">{getPaymentBadge(order.paymentStatus || 'pending')}</td>
                        <td className="p-4 align-middle">{getStatusBadge(order.status || 'pending')}</td>
                        <td className="p-4 align-middle text-right font-bold">₦{(order.totalAmount || 0).toLocaleString()}</td>
                        <td className="p-4 align-middle text-right">
                          <Button variant="ghost" size="icon" title="View details"><Eye className="h-4 w-4" /></Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
