'use client';

import { useParams } from 'next/navigation';
import { useProject } from '@/hooks/useProjects';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: project, isLoading, error } = useProject(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-[400px] w-full mt-6" />
      </div>
    );
  }

  if (error || !project) {
    return <div className="text-red-500">Error loading project details.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
            <Badge>{project.status}</Badge>
          </div>
          <p className="text-muted-foreground">Challenge: {project.challengeTitle}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones & Deliverables</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Description</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <h3 className="font-semibold mb-1">Partner Organization</h3>
                  <p className="text-muted-foreground">{project.organizationName}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Timeline</h3>
                  <p className="text-muted-foreground">
                    {new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones">
          <div className="space-y-4">
            {project.milestones?.length > 0 ? (
              project.milestones.map((milestone) => (
                <Card key={milestone.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                      <Badge variant="outline">{milestone.status}</Badge>
                    </div>
                    <CardDescription>{milestone.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4"><strong>Due:</strong> {new Date(milestone.dueDate).toLocaleDateString()}</p>
                    {milestone.deliverables?.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Deliverables</h4>
                        {milestone.deliverables.map((d) => (
                          <div key={d.id} className="border p-3 rounded-md flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium">{d.title}</p>
                              <p className="text-muted-foreground">{d.description}</p>
                            </div>
                            <Badge variant={d.status === 'APPROVED' ? 'default' : 'secondary'}>
                              {d.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No deliverables for this milestone.</p>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No milestones defined yet.
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Project Members</CardTitle>
            </CardHeader>
            <CardContent>
              {project.members?.length > 0 ? (
                <div className="space-y-4">
                  {project.members.map((member) => (
                    <div key={member.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{member.userName}</p>
                        <p className="text-sm text-muted-foreground">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline">{member.role}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No team members assigned.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="impact">
          <Card>
            <CardHeader>
              <CardTitle>Impact Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              {project.impactMetrics?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.impactMetrics.map((metric) => (
                    <Card key={metric.id}>
                      <CardContent className="p-4">
                        <p className="text-sm font-medium text-muted-foreground mb-1">{metric.metricName}</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold">{metric.metricValue}</span>
                          <span className="text-sm text-muted-foreground">{metric.unit}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Measured {new Date(metric.measuredAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No impact metrics recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
