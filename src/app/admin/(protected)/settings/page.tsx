"use client";

import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage store preferences and global settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Settings</CardTitle>
            <CardDescription>Configure delivery fees and areas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Base Delivery Fee (₦)</Label>
              <Input type="number" defaultValue="1000" />
            </div>
            <div className="space-y-2">
              <Label>Free Delivery Threshold (₦)</Label>
              <Input type="number" defaultValue="20000" />
              <p className="text-xs text-muted-foreground">Orders above this amount get free delivery.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Commission</CardTitle>
            <CardDescription>Global commission rate for vendors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Commission Percentage (%)</Label>
              <Input type="number" defaultValue="15" />
            </div>
            <p className="text-sm text-muted-foreground">
              This percentage will be automatically deducted from vendor payouts on every successful order.
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="gap-2" size="lg">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
