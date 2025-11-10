import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
}

export function StatsCard({ icon, label, value, change, changeLabel }: StatsCardProps) {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <Card className="border-border/50" data-testid={`card-stat-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-3">{label}</div>
            <div className="text-3xl font-semibold tracking-tight mb-1" data-testid={`text-stat-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </div>
            {change !== undefined && (
              <div className="flex items-center gap-1.5 mt-3">
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isPositive ? '+' : ''}{change}%
                </span>
                {changeLabel && <span className="text-xs text-muted-foreground ml-1">{changeLabel}</span>}
              </div>
            )}
          </div>
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
