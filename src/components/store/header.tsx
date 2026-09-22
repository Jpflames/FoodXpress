import Link from "next/link";
import { Leaf, Search, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "./cart-drawer";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground px-4 py-2 text-xs md:text-sm font-medium flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Removed delivering to plateau per request */}
        </div>
        <div className="hidden md:flex gap-4">
          <Link href="/help" className="hover:underline">Help</Link>
          <Link href="/track" className="hover:underline">Track Order</Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              } />
              <SheetContent side="left" className="p-6">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/" className="text-lg font-semibold hover:text-primary">Home</Link>
                  <Link href="/shop" className="text-lg font-semibold hover:text-primary">All Products</Link>
                  <Link href="/shop?category=vegetables" className="text-lg font-semibold hover:text-primary">Vegetables</Link>
                  <Link href="/shop?category=fruits" className="text-lg font-semibold hover:text-primary">Fruits</Link>
                  <Link href="/shop?category=meat-fish" className="text-lg font-semibold hover:text-primary">Meat & Fish</Link>
                  <Link href="/shop?category=dairy-eggs" className="text-lg font-semibold hover:text-primary">Dairy & Eggs</Link>
                </nav>
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold tracking-tight text-foreground">
                FOOD <span className="text-primary">XPRESS</span>
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <Input 
              type="search" 
              placeholder="Search for fresh food, groceries..." 
              className="w-full pr-12 rounded-full border-border bg-muted/50 focus-visible:ring-primary h-12 text-base"
            />
            <Button size="icon" className="absolute right-1 top-1 h-10 w-10 rounded-full bg-primary hover:bg-primary/90">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-6 w-6" />
            </Button>
            <CartDrawer />
          </div>
        </div>

        <nav className="hidden md:flex items-center justify-center gap-8 mt-6">
          <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">All Categories</Link>
          <Link href="/shop?category=vegetables" className="text-sm font-medium hover:text-primary transition-colors">Vegetables</Link>
          <Link href="/shop?category=fruits" className="text-sm font-medium hover:text-primary transition-colors">Fruits</Link>
          <Link href="/shop?category=meat-fish" className="text-sm font-medium hover:text-primary transition-colors">Meat & Fish</Link>
          <Link href="/shop?category=dairy-eggs" className="text-sm font-medium hover:text-primary transition-colors">Dairy & Eggs</Link>
          <Link href="/shop?category=bakery" className="text-sm font-medium hover:text-primary transition-colors">Bakery</Link>
          <Link href="/shop?category=beverages" className="text-sm font-medium hover:text-primary transition-colors">Beverages</Link>
        </nav>
      </div>
    </header>
  );
}
