import Link from "next/link";
import { Leaf } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold tracking-tight text-foreground">
                FOOD <span className="text-primary">XPRESS</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6">
              Fresh Food, Delivered Fast. Get fresh food, groceries and everyday essentials delivered straight to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li><Link href="/shop" className="hover:text-primary">Shop All</Link></li>
              <li><Link href="/track" className="hover:text-primary">Track Order</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/help" className="hover:text-primary">Help & FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
              <li><Link href="/delivery-info" className="hover:text-primary">Delivery Information</Link></li>
              <li><Link href="/refund-policy" className="hover:text-primary">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} FOOD XPRESS. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Secure Payment</span>
            <span>Fast Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
