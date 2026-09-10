'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, ShieldCheck, CheckCircle2, UserPlus, Info } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Recent events and system alerts requiring your attention.</p>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0 divide-y divide-slate-100">
          <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
             <div className="mt-1"><div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Info className="w-5 h-5"/></div></div>
             <div>
                <p className="font-medium text-slate-900">New High Priority Challenge Submitted</p>
                <p className="text-sm text-slate-600 mt-1">A citizen has submitted a CRITICAL infrastructure challenge (#CF-8392) that requires immediate review.</p>
                <p className="text-xs text-slate-400 mt-2">10 minutes ago</p>
             </div>
          </div>
          <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
             <div className="mt-1"><div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><ShieldCheck className="w-5 h-5"/></div></div>
             <div>
                <p className="font-medium text-slate-900">AI Analysis Complete</p>
                <p className="text-sm text-slate-600 mt-1">Automated analysis has finished for 43 pending challenges. Recommendations are ready for verification.</p>
                <p className="text-xs text-slate-400 mt-2">1 hour ago</p>
             </div>
          </div>
          <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
             <div className="mt-1"><div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><UserPlus className="w-5 h-5"/></div></div>
             <div>
                <p className="font-medium text-slate-900">New Collaboration Interest</p>
                <p className="text-sm text-slate-600 mt-1">CivicForge University has expressed interest in collaborating on &quot;Smart City Traffic Light Optimization&quot;.</p>
                <p className="text-xs text-slate-400 mt-2">3 hours ago</p>
             </div>
          </div>
          <div className="p-4 flex gap-4 hover:bg-slate-50 transition-colors">
             <div className="mt-1"><div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><CheckCircle2 className="w-5 h-5"/></div></div>
             <div>
                <p className="font-medium text-slate-900">Project Milestone Reached</p>
                <p className="text-sm text-slate-600 mt-1">The &quot;Clean Water Initiative&quot; project has successfully completed its Prototype phase.</p>
                <p className="text-xs text-slate-400 mt-2">1 day ago</p>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
