import Image from "next/image";
import { notFound } from "next/navigation";
import { mockProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Truck, Heart } from "lucide-react";
// In a real app we'd fetch this by slug.

export default function ProductDetailsPage({ params }: { params: { slug: string } }) {
  const product = mockProducts.find(p => p.slug === params.slug);
  
  if (!product) {
    notFound();
  }

  const discount = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl bg-secondary/20 overflow-hidden">
            <Image 
              src={product.images?.[0] || '/placeholder.png'} 
              alt={product.name} 
              fill 
              className="object-contain p-8"
              priority
            />
          </div>
          {/* Gallery thumbnails would go here */}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-primary bg-primary/10">
              In Stock
            </Badge>
            <button className="p-2 text-muted-foreground hover:text-destructive transition-colors">
              <Heart className="h-6 w-6" />
            </button>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
          <p className="text-muted-foreground text-lg mb-6">{product.unit}</p>
          
          <div className="flex items-end gap-4 mb-8">
            <span className="text-4xl font-bold text-primary">₦{product.price.toLocaleString()}</span>
            {product.compareAtPrice && (
              <span className="text-xl text-muted-foreground line-through mb-1">
                ₦{product.compareAtPrice.toLocaleString()}
              </span>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="mb-2">-{discount}%</Badge>
            )}
          </div>

          <p className="text-muted-foreground mb-8">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 border-y py-8">
            {/* Quantity Selector - For simplicity here, we add to cart directly or build a small client component */}
            <Button size="lg" className="flex-1 h-14 text-lg">Add to Cart</Button>
            <Button size="lg" variant="outline" className="flex-1 h-14 text-lg border-primary text-primary">Buy Now</Button>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span>Sold & fulfilled by <strong className="text-foreground">FOOD XPRESS</strong></span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Truck className="h-5 w-5 text-primary" />
              <span>Fast same-day delivery available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
