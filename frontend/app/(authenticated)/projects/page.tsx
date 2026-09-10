'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderKanban, Plus, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ProjectsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Active Projects</h2>
          <p className="text-muted-foreground">Track ongoing collaborations, prototypes, and deployments.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Initiate Project</Button>
      </div>

      <Card className="shadow-sm mt-6">
        <CardHeader>
          <CardTitle>Project Portfolio</CardTitle>
          <CardDescription>All currently active projects addressing civic challenges.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project ID</TableHead>
                <TableHead>Related Challenge</TableHead>
                <TableHead>Lead Organization</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-sm text-slate-500">PRJ-9021</TableCell>
                <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer">#CF-8102 - River Pollution Cleanup</TableCell>
                <TableCell>CivicForge University</TableCell>
                <TableCell><Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Pilot</Badge></TableCell>
                <TableCell className="w-[150px]"><div className="flex items-center gap-2"><Progress value={60} className="h-2" /><span className="text-xs text-slate-500">60%</span></div></TableCell>
                <TableCell className="text-slate-500">Jul 12, 2025</TableCell>
                <TableCell><Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">On Track</Badge></TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="sm">Manage <ArrowRight className="ml-2 w-4 h-4"/></Button></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm text-slate-500">PRJ-9018</TableCell>
                <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer">#CF-7944 - Smart Traffic Lights</TableCell>
                <TableCell>Tech Solutions India</TableCell>
                <TableCell><Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Deployment</Badge></TableCell>
                <TableCell className="w-[150px]"><div className="flex items-center gap-2"><Progress value={85} className="h-2" /><span className="text-xs text-slate-500">85%</span></div></TableCell>
                <TableCell className="text-slate-500">Jun 05, 2025</TableCell>
                <TableCell><Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">On Track</Badge></TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="sm">Manage <ArrowRight className="ml-2 w-4 h-4"/></Button></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-sm text-slate-500">PRJ-9045</TableCell>
                <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer">#CF-8210 - Public Wi-Fi Expansion</TableCell>
                <TableCell>Dept. of IT & Comms</TableCell>
                <TableCell><Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Proposal</Badge></TableCell>
                <TableCell className="w-[150px]"><div className="flex items-center gap-2"><Progress value={10} className="h-2" /><span className="text-xs text-slate-500">10%</span></div></TableCell>
                <TableCell className="text-slate-500">Aug 20, 2025</TableCell>
                <TableCell><Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">At Risk</Badge></TableCell>
                <TableCell className="text-right"><Button variant="ghost" size="sm">Manage <ArrowRight className="ml-2 w-4 h-4"/></Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
