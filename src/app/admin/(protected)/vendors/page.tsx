"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Edit, Loader2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorEmail, setNewVendorEmail] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchVendors = async () => {
    try {
      const snapshot = await getDocs(collection(db, "vendors"));
      setVendors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim() || !newVendorEmail.trim()) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "vendors"), {
        name: newVendorName,
        email: newVendorEmail,
        status: "Active",
        createdAt: new Date(),
      });
      setIsOpen(false);
      setNewVendorName("");
      setNewVendorEmail("");
      fetchVendors();
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
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground mt-1">Manage marketplace suppliers and partners.</p>
        </div>
        
        <Button onClick={() => setIsOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Vendor
        </Button>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader className="px-6 pt-6">
              <SheetTitle>Add New Vendor</SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSave} className="space-y-4 mt-6 px-6 pb-6">
              <div className="space-y-2">
                <Label>Vendor Name</Label>
                <Input value={newVendorName} onChange={e => setNewVendorName(e.target.value)} required placeholder="e.g. Green Farms Ltd" />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input type="email" value={newVendorEmail} onChange={e => setNewVendorEmail(e.target.value)} required placeholder="vendor@example.com" />
              </div>
              <Button type="submit" disabled={saving} className="w-full mt-4">
                {saving ? "Saving..." : "Save Vendor"}
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
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-12"></th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Vendor Name</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center py-10"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></td></tr>
                  ) : vendors.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">No vendors found in Firebase.</td></tr>
                  ) : vendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-4 align-middle">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                          <Store className="h-5 w-5" />
                        </div>
                      </td>
                      <td className="p-4 align-middle font-medium">{vendor.name}</td>
                      <td className="p-4 align-middle text-muted-foreground">{vendor.email}</td>
                      <td className="p-4 align-middle">
                        <Badge variant={vendor.status === "Active" ? "default" : "secondary"}>{vendor.status || "Active"}</Badge>
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
