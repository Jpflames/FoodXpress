"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/validation/schemas";
import { useCartStore } from "@/hooks/use-cart";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const [added, setAdded] = useState(false);

  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link href={`/products/${product.slug}`} className="block h-full group">
      <Card className="h-full flex flex-col overflow-hidden border-transparent shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2rem] bg-white relative top-0 hover:-top-2">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-secondary/10">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {discount > 0 && (
              <Badge className="bg-destructive/90 text-white font-bold px-3 py-1 text-xs rounded-full shadow-md backdrop-blur-md">
                {discount}% OFF
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-primary/90 text-white font-bold px-3 py-1 text-xs rounded-full shadow-md backdrop-blur-md">
                Top Pick
              </Badge>
            )}
          </div>
          
          {/* Wishlist Button */}
          <button 
            className="absolute top-4 right-4 z-20 p-2.5 text-muted-foreground hover:text-rose-500 bg-white/70 hover:bg-white rounded-full backdrop-blur-md shadow-sm transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
            onClick={(e) => {
              e.preventDefault();
              // wishlist logic here
            }}
          >
            <Heart className="h-4 w-4" />
          </button>
          
          {/* Image */}
          <div className="relative w-full h-full">
            <Image
              src={product.images?.[0] || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {/* Subtle Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>

        {/* Content Area */}
        <CardContent className="p-5 flex flex-col flex-1 relative bg-white z-10">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-foreground text-lg line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                {product.unit}
              </p>
            </div>
          </div>
          
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-secondary/30">
            <div className="flex flex-col">
              {product.compareAtPrice && (
                <span className="text-xs text-muted-foreground line-through font-medium">
                  ₦{product.compareAtPrice.toLocaleString()}
                </span>
              )}
              <span className="font-black text-xl text-foreground">
                ₦{product.price.toLocaleString()}
              </span>
            </div>
            
            <Button 
              size="icon" 
              className={`rounded-2xl h-12 w-12 shadow-lg transition-all duration-300 ${
                added 
                  ? 'bg-emerald-500 hover:bg-emerald-600 scale-110' 
                  : 'bg-primary hover:bg-primary/90 group-hover:shadow-primary/30 group-hover:-translate-y-1'
              }`}
              onClick={handleAddToCart}
            >
              {added ? <Check className="h-5 w-5 text-white" /> : <Plus className="h-6 w-6 text-white" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
