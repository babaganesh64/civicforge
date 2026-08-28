import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, BrainCircuit } from 'lucide-react';
import { AiAnalysisSummary } from '@/types/challenge';

interface AiAnalysisCardProps {
  analysis: AiAnalysisSummary | null;
  isLoading?: boolean;
}

export function AiAnalysisCard({ analysis, isLoading }: AiAnalysisCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-muted-foreground" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-muted-foreground" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No AI analysis available for this challenge yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BrainCircuit className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
        <Badge 
          variant={analysis.status === 'COMPLETED' ? 'default' : analysis.status === 'FAILED' ? 'destructive' : 'secondary'}
        >
          {analysis.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {analysis.status === 'COMPLETED' ? (
          <>
            {analysis.humanOverride && (
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-2 rounded text-sm mb-4">
                <AlertCircle className="h-4 w-4" />
                <span>Human Override Applied</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Suggested Category</p>
                <p className="font-semibold">{analysis.suggestedCategory || 'None'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Suggested Priority</p>
                <p className="font-semibold">{analysis.suggestedPriority || 'None'}</p>
              </div>
            </div>

            {analysis.confidenceScore !== null && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-medium">{analysis.confidenceScore}%</span>
                </div>
                <Progress value={analysis.confidenceScore} className="h-2" />
              </div>
            )}

            {analysis.summary && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Summary</p>
                <p className="text-sm">{analysis.summary}</p>
              </div>
            )}

            {analysis.explanation && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Explanation</p>
                <p className="text-sm bg-muted p-3 rounded-md">{analysis.explanation}</p>
              </div>
            )}
          </>
        ) : analysis.status === 'FAILED' ? (
          <div className="flex flex-col items-center justify-center p-4 text-center text-destructive">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium">AI analysis failed to process.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground space-y-4">
            <BrainCircuit className="h-8 w-8 animate-pulse text-primary/50" />
            <p className="text-sm">Processing AI insights...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
