'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BarChart3, Globe, Shield, Users } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface PublicStats {
  totalChallenges: number;
}

export default function LandingPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['publicStats'],
    queryFn: async () => {
      const response = await apiClient.get<{ data: PublicStats }>('/api/v1/public/stats');
      return response.data;
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Welcome to <span className="text-primary">CivicForge</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A unified platform where citizens, universities, industries, and government collaborate to solve community challenges.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">Citizens</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">Government</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-full">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">Universities</h3>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-amber-500/10 text-amber-500 rounded-full">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground">Industries</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold">Making a Real Impact</h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto pb-4">
            Join the community in identifying and resolving critical issues across the state.
          </p>
          
          <div className="flex justify-center">
            <Card className="bg-primary-foreground/10 border-none shadow-none text-primary-foreground inline-block">
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <div className="text-6xl font-black tabular-nums tracking-tighter">
                  {isLoading ? '...' : (stats?.totalChallenges?.toLocaleString() || '0')}
                </div>
                <div className="text-lg font-medium opacity-90 mt-2 uppercase tracking-widest">
                  Problems Submitted
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40 text-center text-sm text-muted-foreground bg-background">
        <p>&copy; 2026 CivicForge. All rights reserved.</p>
      </footer>
    </div>
  );
}
