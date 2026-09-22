"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Truck, ShieldCheck, HeadphonesIcon, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  return (
    <div className="flex flex-col pb-12 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-green-50 via-white to-green-50 pt-8 pb-16 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10" />
        
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 lg:gap-8 z-10">
          <motion.div 
            className="flex-1 space-y-8 text-center lg:text-left pt-12 lg:pt-0"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/50 text-primary bg-primary/5 rounded-full mb-4 inline-flex items-center gap-2 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now delivering to your doorstep
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.1]">
              Fresh Groceries, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400">
                Delivered Fast
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Skip the supermarket lines. Get farm-fresh food, organic produce, and everyday essentials delivered straight to you in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <Link href="/shop">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto shadow-xl shadow-primary/25 hover:scale-105 transition-transform duration-300">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#categories">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto bg-white/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 hover:scale-105 transition-transform duration-300">
                  Explore Categories
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-x-8 gap-y-4 mt-8 pt-8 border-t border-primary/10 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Fresh & Quality</div>
              <div className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Fast Delivery</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Secure Checkout</div>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-1 w-full relative min-h-[400px] lg:min-h-[600px]"
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] transform rotate-3 scale-105 -z-10" />
            <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-black/5 bg-secondary/10">
               <Image 
                 src="/images/hero.jpg" 
                 alt="Fresh vegetables in a grocery bag" 
                 fill 
                 className="object-cover hover:scale-110 transition-transform duration-1000" 
                 priority
               />
               
               {/* Floating Badges */}
               <motion.div 
                 className="absolute top-8 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-3"
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
               >
                 <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                   <Star className="h-5 w-5 fill-current" />
                 </div>
                 <div>
                   <p className="font-bold text-sm">4.9/5</p>
                   <p className="text-xs text-muted-foreground">Customer Rating</p>
                 </div>
               </motion.div>

               <motion.div 
                 className="absolute bottom-12 left-8 bg-white/90 backdrop-blur-md px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3"
                 animate={{ y: [0, 10, 0] }}
                 transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
               >
                 <div className="h-10 w-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
                   <Truck className="h-5 w-5" />
                 </div>
                 <div>
                   <p className="font-bold text-sm">Fast Delivery</p>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/20 border-none">Browse Store</Badge>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-primary font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { name: "Vegetables", image: "/images/vegitables.jpg" },
            { name: "Fruits", image: "/images/fruits.jpg" },
            { name: "Meat & Fish", image: "/images/meat & fish.jpg" },
            { name: "Dairy & Eggs", image: "/images/dairy & eggs.jpg" },
            { name: "Bakery", image: "/images/bakery.jpg" },
            { name: "Beverages", image: "/images/beverages.jpg" },
          ].map((cat) => (
            <motion.div key={cat.name} variants={itemVariants}>
              <Link href={`/shop?category=${cat.name.toLowerCase().replace(/ & | /g, '-')}`}>
                <Card className="hover:border-primary/50 transition-all duration-300 cursor-pointer group text-center overflow-hidden border-transparent bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 rounded-3xl h-full">
                  <CardContent className="p-0 flex flex-col items-center">
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-secondary/20">
                      <Image 
                        src={cat.image} 
                        alt={cat.name} 
                        fill 
                        unoptimized
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-4 w-full">
                      <h3 className="font-semibold text-foreground text-lg">{cat.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Why FOOD XPRESS Section */}
      <section className="bg-secondary/40 py-20 my-8">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Why Choose FOOD XPRESS?</h2>
            <p className="text-muted-foreground text-lg">We guarantee the best quality products delivered directly to you.</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { title: "Fresh & Quality", desc: "We only deliver the best and freshest products.", icon: CheckCircle },
              { title: "Fast Delivery", desc: "Get your order delivered quickly and safely.", icon: Truck },
              { title: "Secure Payment", desc: "Your payments are protected with top security.", icon: ShieldCheck },
              { title: "24/7 Support", desc: "We are here to help you every step of the way.", icon: HeadphonesIcon },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="bg-white border-none shadow-lg hover:shadow-xl transition-shadow rounded-3xl h-full">
                  <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-2xl text-primary mb-2 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <h4 className="font-bold text-xl">{feature.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto px-4 my-16">
        <motion.div 
          className="relative bg-primary text-primary-foreground rounded-[3rem] p-10 md:p-16 text-center overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">Ready to shop fresh?</h2>
            <p className="text-primary-foreground/90 mb-10 text-xl md:text-2xl font-medium">
              Join thousands of happy customers who trust FOOD XPRESS for their daily grocery needs.
            </p>
            <Link href="/shop">
              <Button size="lg" variant="secondary" className="h-16 px-10 text-xl font-bold rounded-full text-primary hover:scale-105 transition-transform duration-300 shadow-xl shadow-black/10">
                Start Shopping Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
