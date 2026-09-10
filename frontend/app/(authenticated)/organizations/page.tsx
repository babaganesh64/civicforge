'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Plus, ArrowRight } from "lucide-react";
import { useOrganizations } from "@/hooks/useOrganizations";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";

export default function OrganizationsPage() {
  // Use a 5-second polling interval for real-time updates as requested
  const { data: orgsPage, isLoading } = useOrganizations(undefined, 0, 5000);
  const organizations: import('@/types/organization').Organization[] = orgsPage?.content || [];

  const universities = organizations.filter(org => org.orgType === 'UNIVERSITY');
  const government = organizations.filter(org => org.orgType === 'GOVERNMENT');
  const industry = organizations.filter(org => org.orgType === 'INDUSTRY');

  const renderTable = (orgList: typeof organizations) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference ID</TableHead>
          <TableHead>Organization Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
           <TableRow>
             <TableCell colSpan={7} className="text-center py-8 text-slate-500">Loading organizations in real-time...</TableCell>
           </TableRow>
        ) : orgList.length === 0 ? (
           <TableRow>
             <TableCell colSpan={7} className="text-center py-8 text-slate-500">No organizations found for this category.</TableCell>
           </TableRow>
        ) : orgList.map(org => (
          <TableRow key={org.id}>
            <TableCell className="font-medium text-slate-500">{org.referenceId}</TableCell>
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell>
              {org.orgType === 'UNIVERSITY' ? <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">University</Badge> : 
               org.orgType === 'GOVERNMENT' ? <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">Government</Badge> : 
               <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Industry</Badge>}
            </TableCell>
            <TableCell>{org.geography || 'N/A'}</TableCell>
            <TableCell>
              {org.verificationStatus === 'VERIFIED' ? <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Verified</Badge> : 
               <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{org.verificationStatus || 'Pending'}</Badge>}
            </TableCell>
            <TableCell className="text-slate-500">{org.createdAt ? formatDistanceToNow(new Date(org.createdAt), { addSuffix: true }) : 'N/A'}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm">Manage <ArrowRight className="ml-2 w-4 h-4"/></Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Organizations</h2>
          <p className="text-muted-foreground">Manage Universities, Industries, and Government Departments.</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Onboard Organization</Button>
      </div>

      <Card className="shadow-sm mt-6">
        <CardHeader>
          <CardTitle>Registered Entities</CardTitle>
          <CardDescription>A live list of all organizations currently participating in CivicForge.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="universities" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="universities">Universities ({universities.length})</TabsTrigger>
              <TabsTrigger value="government">Government ({government.length})</TabsTrigger>
              <TabsTrigger value="industry">Industry ({industry.length})</TabsTrigger>
              <TabsTrigger value="all">All ({organizations.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="universities">
               {renderTable(universities)}
            </TabsContent>
            
            <TabsContent value="government">
               {renderTable(government)}
            </TabsContent>
            
            <TabsContent value="industry">
               {renderTable(industry)}
            </TabsContent>
            
            <TabsContent value="all">
               {renderTable(organizations)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
