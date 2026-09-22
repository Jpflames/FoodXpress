"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import Image from "next/image";

// We'll define a basic Product type based on what we store
type ProductDoc = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  vendorId: string;
  unit: string;
  stockQuantity: number;
  images: string[];
  isActive: boolean;
  createdAt: any;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    compareAtPrice: "",
    category: "",
    unit: "1kg",
    stock: "50",
    imageFile: null as File | null,
    imagePreview: "",
  });

  const fetchData = async () => {
    try {
      const prodSnapshot = await getDocs(collection(db, "products"));
      const prodDocs = prodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductDoc));
      setProducts(prodDocs);

      const catSnapshot = await getDocs(collection(db, "categories"));
      const catDocs = catSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      setCategories(catDocs);
      
      if (catDocs.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: catDocs[0].id }));
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Missing Cloudinary configuration in .env.local");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Cloudinary upload failed");
    const data = await res.json();
    return data.secure_url; // Returns the uploaded image URL
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let imageUrl = "";
      
      // Upload image if present
      if (formData.imageFile) {
        setIsUploading(true);
        imageUrl = await uploadToCloudinary(formData.imageFile);
        setIsUploading(false);
      }

      // Save to Firestore
      const newProduct = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : null,
        categoryId: formData.category,
        vendorId: "vendor_1", // Default vendor for now
        unit: formData.unit,
        stockQuantity: Number(formData.stock),
        images: imageUrl ? [imageUrl] : [],
        isActive: true,
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, "products"), newProduct);
      
      setIsOpen(false);
      setFormData({ name: "", price: "", compareAtPrice: "", category: categories.length > 0 ? categories[0].id : "", unit: "1kg", stock: "50", imageFile: null, imagePreview: "" });
      fetchData(); // Refresh list
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">Manage inventory, prices, and vendors.</p>
        </div>
        
        <Button onClick={() => setIsOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader className="px-6 pt-6">
              <SheetTitle>Add New Product</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSaveProduct} className="space-y-4 mt-6 px-6 pb-6">
              
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-secondary/10 relative">
                  {formData.imagePreview ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden">
                      <Image src={formData.imagePreview} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Click to upload from Cloudinary</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Fresh Organic Tomatoes" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₦)</Label>
                  <Input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="1500" />
                </div>
                <div className="space-y-2">
                  <Label>Compare at (₦)</Label>
                  <Input type="number" value={formData.compareAtPrice} onChange={e => setFormData({...formData, compareAtPrice: e.target.value})} placeholder="2000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <SelectItem value="loading" disabled>No categories found...</SelectItem>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Input required value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} placeholder="e.g. 1kg, 1 Loaf" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Stock Quantity</Label>
                <Input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} placeholder="50" />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={isSaving}>
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isUploading ? 'Uploading Image...' : 'Saving...'}</> : 'Save Product'}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2 w-full">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search products..." 
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
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12">Image</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-10 text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" /> Loading products from Firebase...</td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">No products found in Firestore. Add one above!</td></tr>
                  ) : filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle">
                        <div className="h-10 w-10 relative rounded overflow-hidden bg-secondary">
                          <Image src={product.images?.[0] || '/placeholder.png'} alt={product.name} fill className="object-cover" />
                        </div>
                      </td>
                      <td className="p-4 align-middle font-medium">{product.name}</td>
                      <td className="p-4 align-middle">₦{product.price.toLocaleString()}</td>
                      <td className="p-4 align-middle">{product.stockQuantity}</td>
                      <td className="p-4 align-middle">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Active" : "Draft"}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
