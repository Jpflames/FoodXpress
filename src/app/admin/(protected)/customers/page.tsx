"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground mt-1">Manage platform users and customer data.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h2 className="text-2xl font-semibold mb-2">No Customers Yet</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Customer accounts will appear here once the public registration feature is enabled and users start signing up.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
