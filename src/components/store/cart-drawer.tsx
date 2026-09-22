"use client";

import { ShoppingCart, Trash2, Plus, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useCartStore } from "@/hooks/use-cart";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export function CartDrawer() {
  const { items, getCartTotal, getCartCount, updateQuantity, removeItem } = useCartStore();
  
  // Prevent hydration mismatch by only rendering after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const total = getCartTotal();
  const count = getCartCount();

  if (!mounted) {
    return (
      <Button variant="outline" className="relative flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white">
        <ShoppingCart className="h-5 w-5" />
        <span className="font-semibold">0</span>
      </Button>
    );
  }

  return (
    <Sheet>
      <SheetTrigger render={
        <Button variant="outline" className="relative flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white">
          <ShoppingCart className="h-5 w-5" />
          <span className="font-semibold">{count}</span>
        </Button>
      } />
      <SheetContent className="flex flex-col w-full sm:max-w-md p-6">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
            <ShoppingCart className="h-6 w-6 text-primary" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold">Your cart is empty</h3>
              <p className="text-muted-foreground">
                Looks like you haven't added any fresh food yet.
              </p>
              <SheetClose render={
                <Button 
                  className="mt-4" 
                  variant="default"
                  onClick={() => window.location.href = '/shop'}
                >
                  Start Shopping
                </Button>
              } />
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={item.images?.[0] || '/placeholder.png'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.unit}</p>
                    <div className="font-semibold mt-1">₦{item.price.toLocaleString()}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeItem(item.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center border rounded-md h-8">
                      <button 
                        className="px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => updateQuantity(item.id!, item.cartQuantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{item.cartQuantity}</span>
                      <button 
                        className="px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => updateQuantity(item.id!, item.cartQuantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t pt-4 flex-col gap-4 sm:flex-col">
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">₦{total.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Delivery fee calculated at checkout.
              </p>
            </div>
            <SheetClose render={
              <Button 
                className="w-full size-lg text-lg h-14 bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25" 
                variant="default"
                onClick={() => window.location.href = '/checkout'}
              >
                Proceed to Checkout
              </Button>
            } />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
