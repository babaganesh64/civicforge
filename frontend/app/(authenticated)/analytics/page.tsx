'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardCharts } from "@/components/dashboard-charts";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Analytics</h2>
          <p className="text-muted-foreground">Deep dive into challenge volumes, verification rates, and project conversions.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mt-6">
        <Card>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm text-slate-500">Verification Rate</CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">84.2%</div><p className="text-xs text-green-600 mt-1">+2.1% from last month</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm text-slate-500">Project Conversion</CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">12.8%</div><p className="text-xs text-green-600 mt-1">+0.4% from last month</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm text-slate-500">Avg Resolution Time</CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">42 Days</div><p className="text-xs text-red-600 mt-1">+3 days from last month</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm text-slate-500">Citizen Engagement</CardTitle>
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">12,403</div><p className="text-xs text-green-600 mt-1">+1,204 new users</p></CardContent>
        </Card>
      </div>

      <DashboardCharts />
    </div>
  );
}
