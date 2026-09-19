"use client";

import { useOrganization } from "@/hooks/useOrganizations";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, MapPin, Mail, Phone, ExternalLink, Users, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useChallenges } from "@/hooks/useChallenges";

export default function OrganizationManagePage() {
  const params = useParams();
  const orgId = params.id as string;
  const { data: org, isLoading, error } = useOrganization(orgId);
  const { data: challengesPage } = useChallenges({ page: 0 });

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-96 w-full mt-6" />
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6 text-center">
        <h2 className="text-2xl font-bold text-destructive">Organization Not Found</h2>
        <p className="text-muted-foreground">The organization you are looking for does not exist or you don&apos;t have permission.</p>
        <Link href="/organizations">
          <Button className="mt-4"><ArrowLeft className="mr-2 w-4 h-4" /> Back to Organizations</Button>
        </Link>
      </div>
    );
  }

  // Filter assigned projects (frontend fallback if needed)
  // In a real prod environment, this would be a dedicated backend endpoint.
  // const assignedChallenges = challengesPage?.content.filter(c => c.assignedOrgId === orgId) || [];
  const assignedChallenges = []; // Mocked for UI structure right now as ListItem doesn't return assignedOrgId

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Link href="/organizations">
          <Button variant="ghost" size="sm" className="mb-2 text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{org.name}</h1>
            {org.verificationStatus === 'VERIFIED' && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-4 text-muted-foreground text-sm">
            <span className="flex items-center"><Building2 className="w-4 h-4 mr-1" /> {org.orgType}</span>
            {org.geography && <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {org.geography}</span>}
            <span className="text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">ID: {org.referenceId}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">Edit Profile</Button>
          <Button>Assign New Project</Button>
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Assigned Projects</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Projects & Challenges</CardTitle>
              <CardDescription>
                Challenges and projects currently routed to {org.shortName || org.name}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assignedChallenges.length > 0 ? (
                <div className="space-y-4">
                   {/* Render projects here in future */}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg border-muted">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <h3 className="text-lg font-medium text-foreground">No Projects Assigned</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    There are currently no challenges or projects assigned to this organization.
                  </p>
                  <Button variant="outline">Browse Challenges to Assign</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>About Organization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {org.description || "No description provided for this organization."}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Email</span>
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-slate-400" />
                      {org.contactEmail || 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact Phone</span>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-slate-400" />
                      {org.contactPhone || 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Website</span>
                    <div className="flex items-center text-sm">
                      <ExternalLink className="w-4 h-4 mr-2 text-slate-400" />
                      {org.website ? <a href={org.website} target="_blank" rel="noreferrer" className="text-primary hover:underline">{org.website}</a> : 'N/A'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Domains & Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3">Focus Domains</h4>
                  <div className="flex flex-wrap gap-2">
                    {org.domains && org.domains.length > 0 ? org.domains.map((domain, i) => (
                      <Badge key={i} variant="secondary">{domain}</Badge>
                    )) : <span className="text-sm text-muted-foreground">Not specified</span>}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-3">Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {org.capabilities && org.capabilities.length > 0 ? org.capabilities.map((cap, i) => (
                      <Badge key={i} variant="outline">{cap}</Badge>
                    )) : <span className="text-sm text-muted-foreground">Not specified</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage the users who have access to this organization.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium">Members Management</h3>
                <p className="text-sm text-muted-foreground">User invites and role management coming soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
