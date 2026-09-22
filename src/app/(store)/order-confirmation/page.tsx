"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
      <div className="flex justify-center mb-6">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-primary" />
        </div>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-muted-foreground text-lg mb-8">
        Thank you for shopping with FOOD XPRESS. Your order has been received and is currently being processed.
      </p>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-left">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="font-bold text-lg">{orderId || "FX-PENDING"}</p>
            </div>
            <div className="w-px h-12 bg-border hidden md:block"></div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-bold">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="w-px h-12 bg-border hidden md:block"></div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="font-bold">Paystack</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link href="/track">
          <Button variant="outline" size="lg" className="w-full h-14 border-primary text-primary gap-2">
            <Truck className="h-5 w-5" /> Track Order
          </Button>
        </Link>
        <Link href="/shop">
          <Button size="lg" className="w-full h-14 gap-2">
            <Package className="h-5 w-5" /> Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center">Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}
