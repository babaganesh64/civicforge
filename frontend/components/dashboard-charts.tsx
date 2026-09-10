"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useChallenges } from '@/hooks/useChallenges';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#8b5cf6', '#ec4899'];

export function DashboardCharts() {
  // Fetch up to 500 recent challenges to compute real analytics
  const { data: challengesPage, isLoading } = useChallenges({ size: 500 });
  const challenges = challengesPage?.content || [];

  // Group by category for Pie Chart
  const categoryCount: Record<string, number> = {};
  // Group by month for Bar Chart (assuming this year)
  const monthCount: Record<string, number> = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthNames.forEach(m => monthCount[m] = 0); // Initialize all months

  challenges.forEach(challenge => {
    // Pie Chart
    const cat = challenge.category || 'Uncategorized';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;

    // Bar Chart
    if (challenge.submittedAt) {
      const date = new Date(challenge.submittedAt);
      const monthStr = monthNames[date.getMonth()];
      monthCount[monthStr] = (monthCount[monthStr] || 0) + 1;
    }
  });

  const pieData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  const barData = Object.entries(monthCount)
    // Only keep months up to the current month for a cleaner chart
    .filter(([month], idx) => idx <= new Date().getMonth() || monthCount[month] > 0)
    .map(([name, challenges]) => ({ name, challenges }));

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Skeleton className="h-[350px] w-full" />
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Challenges Over Time</CardTitle>
          <CardDescription>Monthly submission volume based on real data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} />
                <Bar dataKey="challenges" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Challenges by Category</CardTitle>
          <CardDescription>Distribution across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {pieData.length === 0 ? (
               <div className="h-full flex items-center justify-center text-slate-500">No category data available</div>
            ) : (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={pieData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={100}
                     paddingAngle={2}
                     dataKey="value"
                   >
                     {pieData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
