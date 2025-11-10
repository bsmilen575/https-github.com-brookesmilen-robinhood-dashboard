import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Recommendation } from '@shared/schema';
import { AlertTriangle, Package, TrendingUp, MapPin } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const getPriorityColor = (priority: Recommendation['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-rose-500/75 text-white';
      case 'high': return 'bg-orange-400/65 text-white';
      case 'medium': return 'bg-sky-500/60 text-white';
      case 'low': return 'bg-slate-400/50 text-white';
    }
  };

  const getCategoryIcon = (category: Recommendation['category']) => {
    switch (category) {
      case 'supply': return <Package className="w-3.5 h-3.5" />;
      case 'capacity': return <TrendingUp className="w-3.5 h-3.5" />;
      case 'logistics': return <AlertTriangle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <Card data-testid="card-operational-actions">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Operational Actions</CardTitle>
          <Badge variant="secondary" className="text-xs" data-testid="badge-action-count">
            {recommendations.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-[650px]">
          <table className="w-full text-sm">
            <thead className="border-b border-border/50 bg-muted/20 sticky top-0 z-10">
              <tr>
                <th className="text-left p-3 font-medium w-8">#</th>
                <th className="text-left p-3 font-medium w-20">Priority</th>
                <th className="text-left p-3 font-medium">Action Required</th>
                <th className="text-left p-3 font-medium">Level-Load Suggestions</th>
              </tr>
            </thead>
            <tbody>
              {recommendations.map((rec, index) => (
                <tr 
                  key={rec.id} 
                  className="border-b border-border/40 last:border-b-0"
                  data-testid={`row-recommendation-${rec.id}`}
                >
                  <td className="p-3 text-muted-foreground align-top">
                    {index + 1}
                  </td>
                  <td className="p-3 align-top">
                    <div className="flex flex-col gap-1.5">
                      <Badge className={`${getPriorityColor(rec.priority)} text-xs w-fit border-transparent`}>
                        {rec.priority}
                      </Badge>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {getCategoryIcon(rec.category)}
                        <span className="text-xs capitalize">{rec.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 align-top">
                    <div className="space-y-1">
                      <div className="font-medium text-foreground">{rec.title}</div>
                      <div className="text-xs text-muted-foreground">{rec.description}</div>
                    </div>
                  </td>
                  <td className="p-3 align-top">
                    {rec.levelLoadSuggestions && rec.levelLoadSuggestions.length > 0 ? (
                      <div className="space-y-2">
                        {rec.levelLoadSuggestions.map((suggestion, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-2 text-xs bg-primary/5 rounded-md px-2.5 py-2"
                            data-testid={`suggestion-${rec.id}-${idx}`}
                          >
                            <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-primary" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground">
                                {suggestion.sourceName}
                              </div>
                              <div className="text-muted-foreground mt-0.5">
                                {suggestion.sourceCity} • {suggestion.availableKits.toLocaleString()} kits • {suggestion.distanceMiles} mi
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : rec.purchaseSuggestion ? (
                      <div 
                        className="flex items-start gap-2 text-xs bg-amber-500/5 rounded-md px-2.5 py-2"
                        data-testid={`purchase-suggestion-${rec.id}`}
                      >
                        <Package className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-amber-600" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground">
                            {rec.purchaseSuggestion}
                          </div>
                          <div className="text-muted-foreground mt-0.5">
                            No nearby sources available for level-loading
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground">
                        No nearby sources
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
