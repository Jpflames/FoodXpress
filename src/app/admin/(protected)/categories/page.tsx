"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, "categories"));
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "categories"), {
        name: newCatName,
        slug: newCatName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        status: "Active",
        createdAt: new Date(),
      });
      setIsOpen(false);
      setNewCatName("");
      fetchCategories();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your products into collections.</p>
        </div>
        
        <Button onClick={() => setIsOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader className="px-6 pt-6">
              <SheetTitle>Add New Category</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSave} className="space-y-4 mt-6 px-6 pb-6">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input value={newCatName} onChange={e => setNewCatName(e.target.value)} required placeholder="e.g. Vegetables" />
              </div>
              <Button type="submit" disabled={saving} className="w-full mt-4">
                {saving ? "Saving..." : "Save Category"}
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Slug</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-10"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></td></tr>
                  ) : categories.length === 0 ? (
                    <tr><td colSpan={4} className="text-center py-10 text-muted-foreground">No categories found in Firebase.</td></tr>
                  ) : categories.map((cat) => (
                    <tr key={cat.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle font-medium">{cat.name}</td>
                      <td className="p-4 align-middle text-muted-foreground">{cat.slug}</td>
                      <td className="p-4 align-middle">
                        <Badge variant={cat.status === "Active" ? "default" : "secondary"}>{cat.status || "Active"}</Badge>
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
