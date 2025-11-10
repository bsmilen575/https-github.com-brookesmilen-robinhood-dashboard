import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { MachineTypeSummary } from '@shared/schema';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface MachineTypeSummaryProps {
  summaries: MachineTypeSummary[];
}

export function MachineTypeSummary({ summaries }: MachineTypeSummaryProps) {
  const [sortField, setSortField] = useState<keyof MachineTypeSummary>('machineType');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof MachineTypeSummary) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSummaries = [...summaries].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * modifier;
    }
    if (Array.isArray(aVal) && Array.isArray(bVal)) {
      return (aVal.length - bVal.length) * modifier;
    }
    return ((aVal as number) - (bVal as number)) * modifier;
  });

  const SortIcon = ({ field }: { field: keyof MachineTypeSummary }) => {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 opacity-30" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-3 h-3" /> : 
      <ChevronDown className="w-3 h-3" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Summary by Machine Type</CardTitle>
        <p className="text-sm text-muted-foreground">Weekly testing and supply health metrics organized by testing machine type</p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b sticky top-0">
              <tr>
                <th className="text-left px-4 py-3">
                  <button
                    onClick={() => handleSort('machineType')}
                    className="flex items-center gap-1 text-xs font-medium hover-elevate active-elevate-2 px-2 py-1 -mx-2 -my-1 rounded-md"
                    data-testid="button-sort-machine-type"
                  >
                    Machine Type <SortIcon field="machineType" />
                  </button>
                </th>
                <th className="text-right px-4 py-3">
                  <button
                    onClick={() => handleSort('totalLocations')}
                    className="flex items-center gap-1 text-xs font-medium hover-elevate active-elevate-2 px-2 py-1 -mx-2 -my-1 rounded-md ml-auto"
                    data-testid="button-sort-locations"
                  >
                    Locations <SortIcon field="totalLocations" />
                  </button>
                </th>
                <th className="text-right px-4 py-3">
                  <button
                    onClick={() => handleSort('totalTestKits')}
                    className="flex items-center gap-1 text-xs font-medium hover-elevate active-elevate-2 px-2 py-1 -mx-2 -my-1 rounded-md ml-auto"
                    data-testid="button-sort-test-kits"
                  >
                    Total test kits on-hand <SortIcon field="totalTestKits" />
                  </button>
                </th>
                <th className="text-right px-4 py-3">
                  <button
                    onClick={() => handleSort('weeklyTests')}
                    className="flex items-center gap-1 text-xs font-medium hover-elevate active-elevate-2 px-2 py-1 -mx-2 -my-1 rounded-md ml-auto"
                    data-testid="button-sort-weekly-tests"
                  >
                    Average weekly burn rate <SortIcon field="weeklyTests" />
                  </button>
                </th>
                <th className="text-right px-4 py-3">
                  <button
                    onClick={() => handleSort('avgDaysRemaining')}
                    className="flex items-center gap-1 text-xs font-medium hover-elevate active-elevate-2 px-2 py-1 -mx-2 -my-1 rounded-md ml-auto"
                    data-testid="button-sort-days-remaining"
                  >
                    Avg Days <SortIcon field="avgDaysRemaining" />
                  </button>
                </th>
                <th className="text-center px-4 py-3">
                  <div className="text-xs font-medium">Health Status</div>
                  <div className="text-[10px] text-muted-foreground font-normal">(# sites by health measure)</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedSummaries.map((summary, index) => (
                <tr
                  key={summary.machineType}
                  className={`border-b hover-elevate ${index % 2 === 0 ? 'bg-muted/20' : ''}`}
                  data-testid={`row-machine-${summary.machineType.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{summary.machineType}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{summary.totalLocations}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{summary.totalTestKits.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{summary.weeklyTests.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{summary.avgDaysRemaining}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {summary.criticalCount > 0 && (
                        <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 text-xs">
                          {summary.criticalCount}
                        </Badge>
                      )}
                      {summary.warningCount > 0 && (
                        <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 text-xs">
                          {summary.warningCount}
                        </Badge>
                      )}
                      {summary.healthyCount > 0 && (
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs">
                          {summary.healthyCount}
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 bg-muted/40 font-semibold">
                <td className="px-4 py-3">
                  <div className="font-semibold text-sm">TOTAL</div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {summaries.reduce((sum, s) => sum + s.totalLocations, 0)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {summaries.reduce((sum, s) => sum + s.totalTestKits, 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {summaries.reduce((sum, s) => sum + s.weeklyTests, 0).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm">
                  {Math.round(summaries.reduce((sum, s) => sum + s.avgDaysRemaining, 0) / summaries.length)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="outline" className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 text-xs">
                      {summaries.reduce((sum, s) => sum + s.criticalCount, 0)}
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 text-xs">
                      {summaries.reduce((sum, s) => sum + s.warningCount, 0)}
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 text-xs">
                      {summaries.reduce((sum, s) => sum + s.healthyCount, 0)}
                    </Badge>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
