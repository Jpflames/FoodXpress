"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/store/product-card";
import { db } from "@/lib/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

function ShopContent() {
  const searchParams = useSearchParams();
  const rawCat = searchParams.get("category");
  const [activeCategorySlug, setActiveCategorySlug] = useState(rawCat || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnap = await getDocs(collection(db, "products"));
        setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const catSnap = await getDocs(collection(db, "categories"));
        setDbCategories(catSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let isCatMatch = true;
    if (activeCategorySlug !== "all") {
      // Find the category ID that corresponds to the active slug/name
      const activeCat = dbCategories.find(c => 
        (c.slug && c.slug.toLowerCase() === activeCategorySlug.toLowerCase()) || 
        (c.name && c.name.toLowerCase() === activeCategorySlug.toLowerCase())
      );
      
      if (activeCat) {
        isCatMatch = product.categoryId === activeCat.id;
      } else {
        // Fallback for mock data or if category isn't found
        isCatMatch = false;
      }
    }

    return isCatMatch && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-primary/5 rounded-[2rem] p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-foreground">
            {activeCategorySlug === "all" ? "Fresh Market" : (dbCategories.find(c => (c.slug || c.name).toLowerCase() === activeCategorySlug.toLowerCase())?.name || "Products")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Discover our wide selection of farm-fresh produce and everyday essentials.
          </p>
        </div>
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input 
            placeholder="Search fresh food..." 
            className="pl-12 h-14 rounded-full bg-white shadow-sm border-transparent focus-visible:ring-primary text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-8 flex-shrink-0">
          <div>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5" /> Categories
            </h3>
            <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
              <button
                onClick={() => setActiveCategorySlug("all")}
                className={`px-4 py-2.5 rounded-full md:rounded-lg text-sm font-medium transition-all whitespace-nowrap text-left ${
                  activeCategorySlug === "all" 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-secondary/50 text-foreground hover:bg-secondary"
                }`}
              >
                All
              </button>
              {dbCategories.map((cat) => {
                const slug = cat.slug || cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategorySlug(slug)}
                    className={`px-4 py-2.5 rounded-full md:rounded-lg text-sm font-medium transition-all whitespace-nowrap text-left ${
                      activeCategorySlug.toLowerCase() === slug.toLowerCase()
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "bg-secondary/50 text-foreground hover:bg-secondary"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-secondary/20 rounded-3xl">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
              <Button 
                variant="outline" 
                className="mt-6 rounded-full"
                onClick={() => { setSearchQuery(""); setActiveCategorySlug("all"); }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={product.id}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}
