import React from 'react';
import { HistoryItem } from '@/types/challenge';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, XCircle, AlertCircle, Info, User } from 'lucide-react';

interface ChallengeTimelineProps {
  history: HistoryItem[];
}

export function ChallengeTimeline({ history }: ChallengeTimelineProps) {
  if (!history || history.length === 0) {
    return <p className="text-sm text-muted-foreground">No activity recorded yet.</p>;
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'SUBMIT':
      case 'VERIFY':
      case 'PUBLISH':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'REJECT':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'REQUEST_CLARIFICATION':
        return 'text-amber-500 bg-amber-50 border-amber-200';
      default:
        return 'text-blue-500 bg-blue-50 border-blue-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'SUBMIT':
      case 'VERIFY':
      case 'PUBLISH':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'REJECT':
        return <XCircle className="h-4 w-4" />;
      case 'REQUEST_CLARIFICATION':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
      {history.map((item, index) => {
        const colorClass = getActionColor(item.action);
        
        return (
          <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            {/* Icon */}
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${colorClass}`}>
              {getActionIcon(item.action)}
            </div>
            
            {/* Content Card */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border shadow-sm bg-card">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-sm capitalize">{item.action.replace(/_/g, ' ').toLowerCase()}</h4>
                <time className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                </time>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground mb-2">
                <User className="h-3 w-3 mr-1" />
                {item.actorEmail || 'System'}
              </div>

              {item.notes && (
                <p className="text-sm bg-muted/50 p-2 rounded text-foreground mt-2 border">
                  {item.notes}
                </p>
              )}
              
              {(item.fromStatus || item.toStatus) && (
                <div className="mt-2 text-xs font-mono bg-muted inline-block px-1.5 py-0.5 rounded">
                  {item.fromStatus && <span>{item.fromStatus} &rarr; </span>}
                  <span className="font-semibold">{item.toStatus}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
