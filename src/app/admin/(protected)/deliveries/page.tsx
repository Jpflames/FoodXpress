"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function DeliveriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deliveries</h1>
        <p className="text-muted-foreground mt-1">Track and manage order dispatches.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <Truck className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h2 className="text-2xl font-semibold mb-2">Delivery Management</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Once orders are dispatched, they will appear here for real-time tracking and driver assignment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
