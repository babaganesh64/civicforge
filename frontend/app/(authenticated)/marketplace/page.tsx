'use client';

import { useState } from 'react';
import { useChallenges } from '@/hooks/useChallenges';
import { ChallengeStatus } from '@/types/challenge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  
  const { data, isLoading, error } = useChallenges({
    status: ChallengeStatus.PUBLISHED,
    search: search || undefined
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Challenge Marketplace</h1>
          <p className="text-muted-foreground mt-2">
            Browse published challenges and submit your Expression of Interest.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search challenges..." 
            className="w-full sm:w-[300px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="flex flex-col justify-between">
              <CardHeader>
                <Skeleton className="h-4 w-1/4 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">Error loading challenges.</div>
      ) : data?.content.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium">No challenges found</h3>
          <p className="text-muted-foreground">Check back later for new opportunities.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.content.map((challenge) => (
            <Card key={challenge.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{challenge.referenceNumber}</Badge>
                  {challenge.priority && (
                    <Badge variant={challenge.priority === 'HIGH' || challenge.priority === 'CRITICAL' ? 'destructive' : 'secondary'}>
                      {challenge.priority}
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-2">{challenge.title}</CardTitle>
                <CardDescription>{challenge.category}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-sm text-muted-foreground mb-4">
                  <strong>Location:</strong> {challenge.city}, {challenge.stateProvince}
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/challenges/${challenge.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
