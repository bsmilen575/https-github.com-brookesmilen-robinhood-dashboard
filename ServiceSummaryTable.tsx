import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ServiceSummary } from '@shared/schema';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useMemo } from 'react';

interface ServiceSummaryTableProps {
  summaries: ServiceSummary[];
}

type SortField = 'service' | 'totalLocations' | 'avgDaysRemaining';
type SortDirection = 'asc' | 'desc';

export function ServiceSummaryTable({ summaries }: ServiceSummaryTableProps) {
  const [sortField, setSortField] = useState<SortField>('avgDaysRemaining');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSummaries = useMemo(() => {
    return [...summaries].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [summaries, sortField, sortDirection]);

  const totals = useMemo(() => {
    return summaries.reduce(
      (acc, summary) => ({
        totalLocations: acc.totalLocations + summary.totalLocations,
        totalTestKits: acc.totalTestKits + summary.totalTestKits,
        weeklyTests: acc.weeklyTests + summary.weeklyTests,
        healthyCount: acc.healthyCount + summary.healthyCount,
        warningCount: acc.warningCount + summary.warningCount,
        criticalCount: acc.criticalCount + summary.criticalCount,
      }),
      {
        totalLocations: 0,
        totalTestKits: 0,
        weeklyTests: 0,
        healthyCount: 0,
        warningCount: 0,
        criticalCount: 0,
      }
    );
  }, [summaries]);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortField === field;
    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md transition-colors"
        data-testid={`button-sort-${field}`}
      >
        {children}
        {isActive && (
          sortDirection === 'asc' ? (
            <ChevronUp className="w-4 h-4" data-testid={`icon-sort-asc-${field}`} />
          ) : (
            <ChevronDown className="w-4 h-4" data-testid={`icon-sort-desc-${field}`} />
          )
        )}
      </button>
    );
  };

  return (
    <Card data-testid="card-service-summary">
      <CardHeader>
        <CardTitle data-testid="text-title">Service Summary</CardTitle>
        <div className="flex items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-blue-400 rounded-sm" />
            <span className="text-muted-foreground">Test kits on hand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-black dark:bg-white rounded-sm" />
            <span className="text-muted-foreground">Weekly burn rate</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="table-service-summary">
            <thead>
              <tr className="border-b">
                <th rowSpan={2} className="text-left py-3 px-4 font-semibold align-bottom">
                  <SortButton field="service">Service</SortButton>
                </th>
                <th rowSpan={2} className="text-left py-3 px-4 font-semibold align-bottom">
                  <SortButton field="totalLocations">Locations</SortButton>
                </th>
                <th rowSpan={2} className="text-left py-3 px-4 font-semibold align-bottom">Total test kits on hand vs. Avg weekly burn rate</th>
                <th colSpan={3} className="text-center py-2 px-4 font-semibold text-sm border-b">
                  Summary of bases by health status
                </th>
              </tr>
              <tr className="border-b">
                <th className="text-center py-2 px-4 font-medium text-sm">Critical</th>
                <th className="text-center py-2 px-4 font-medium text-sm">Warning</th>
                <th className="text-center py-2 px-4 font-medium text-sm">Healthy</th>
              </tr>
            </thead>
            <tbody>
              {sortedSummaries.map((summary) => {
                const maxValue = Math.max(summary.totalTestKits, summary.weeklyTests);
                const testKitsWidth = maxValue > 0 ? (summary.totalTestKits / maxValue) * 100 : 0;
                const weeklyTestsWidth = maxValue > 0 ? (summary.weeklyTests / maxValue) * 100 : 0;

                return (
                  <tr 
                    key={summary.service} 
                    className="border-b hover-elevate"
                    data-testid={`row-service-${summary.service}`}
                  >
                    <td className="py-3 px-4" data-testid={`text-service-${summary.service}`}>
                      {summary.service}
                    </td>
                    <td className="py-3 px-4" data-testid={`text-locations-${summary.service}`}>
                      {summary.totalLocations}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-2 min-w-[200px]" data-testid={`chart-bars-${summary.service}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-blue-400 h-2 rounded-full transition-all"
                              style={{ width: `${testKitsWidth}%` }}
                              data-testid={`bar-testkits-${summary.service}`}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground min-w-[60px]">
                            {summary.totalTestKits.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-black dark:bg-white h-2 rounded-full transition-all"
                              style={{ width: `${weeklyTestsWidth}%` }}
                              data-testid={`bar-weeklytests-${summary.service}`}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground min-w-[60px]">
                            {summary.weeklyTests.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center" data-testid={`text-critical-${summary.service}`}>
                      <Badge 
                        variant="outline"
                        className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                      >
                        {summary.criticalCount}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center" data-testid={`text-warning-${summary.service}`}>
                      <Badge 
                        variant="outline"
                        className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                      >
                        {summary.warningCount}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center" data-testid={`text-healthy-${summary.service}`}>
                      <Badge 
                        variant="outline" 
                        className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                      >
                        {summary.healthyCount}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-semibold bg-muted/50">
                <td className="py-3 px-4" data-testid="text-footer-total">Total</td>
                <td className="py-3 px-4" data-testid="text-footer-locations">
                  {totals.totalLocations}
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-2 min-w-[200px]" data-testid="chart-footer-bars">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-blue-400 h-2 rounded-full transition-all"
                          style={{ width: '100%' }}
                          data-testid="bar-footer-testkits"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground min-w-[60px]">
                        {totals.totalTestKits.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-black dark:bg-white h-2 rounded-full transition-all"
                          style={{ width: '100%' }}
                          data-testid="bar-footer-weeklytests"
                        />
                      </div>
                      <span className="text-xs text-muted-foreground min-w-[60px]">
                        {totals.weeklyTests.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-center" data-testid="text-footer-critical">
                  <Badge 
                    variant="outline"
                    className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                    data-testid="badge-footer-critical"
                  >
                    {totals.criticalCount}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-center" data-testid="text-footer-warning">
                  <Badge 
                    variant="outline"
                    className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                    data-testid="badge-footer-warning"
                  >
                    {totals.warningCount}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-center" data-testid="text-footer-healthy">
                  <Badge 
                    variant="outline"
                    className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                    data-testid="badge-footer-healthy"
                  >
                    {totals.healthyCount}
                  </Badge>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
