//todo: remove mock functionality
import { useState, useMemo } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { LocationMap } from '@/components/LocationMap';
import { ServiceSummaryTable } from '@/components/ServiceSummaryTable';
import { MachineTypeSummary } from '@/components/MachineTypeSummary';
import { RecommendationsList } from '@/components/RecommendationsList';
import { generateLocations, generateServiceSummaries, generateMachineTypeSummaries, generateRecommendations } from '@/lib/mockData';
import { Package, AlertTriangle, TrendingUp, MapPin, Map, Building2, Boxes, ListTodo } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [activeView, setActiveView] = useState('services');
  
  const locations = useMemo(() => generateLocations(133), []);
  const serviceSummaries = useMemo(() => generateServiceSummaries(locations), [locations]);
  const machineSummaries = useMemo(() => generateMachineTypeSummaries(locations), [locations]);
  const recommendations = useMemo(() => generateRecommendations(locations), [locations]);

  const stats = {
    totalLocations: locations.length,
    totalTestKits: locations.reduce((sum, loc) => sum + loc.testKitsInStock, 0),
    weeklyTests: locations.reduce((sum, loc) => sum + loc.weeklyTestsCompleted, 0),
    criticalLocations: locations.filter(loc => loc.status === 'critical').length,
  };

  const navItems = [
    { id: 'services', label: 'By Service', icon: Building2 },
    { id: 'machines', label: 'By Machine Type', icon: Boxes },
    { id: 'map', label: 'Global Map', icon: Map },
    { id: 'actions', label: 'Operational Actions', icon: ListTodo },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'map':
        return <LocationMap locations={locations} />;
      case 'services':
        return <ServiceSummaryTable summaries={serviceSummaries} />;
      case 'machines':
        return <MachineTypeSummary summaries={machineSummaries} />;
      case 'actions':
        return <RecommendationsList recommendations={recommendations} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="text-2xl font-semibold tracking-tight">Operations Dashboard</h1>
          <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Real-time</span>
        </div>
        <p className="text-sm text-muted-foreground">Monitor test kit inventory and supply chain across 133 DoD facilities</p>
      </div>

      {/* Secondary Navigation (View Tabs) */}
      <div className="border-b border-border/50">
        <nav className="flex gap-1" data-testid="view-tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                data-testid={`tab-${item.id}`}
                aria-pressed={isActive}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Stats Cards */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                icon={<MapPin className="w-6 h-6" />}
                label="Total Locations"
                value={stats.totalLocations}
              />
              <StatsCard
                icon={<Package className="w-6 h-6" />}
                label="Current test kits on hand"
                value={`${(stats.totalTestKits / 1000).toFixed(1)}K`}
                change={5.2}
                changeLabel="vs last week"
              />
              <StatsCard
                icon={<TrendingUp className="w-6 h-6" />}
                label="Average weekly tests conducted"
                value={`${(stats.weeklyTests / 1000).toFixed(1)}K`}
                change={8.3}
                changeLabel="vs last week"
              />
              <StatsCard
                icon={<AlertTriangle className="w-6 h-6" />}
                label="Critical locations (i.e., <3 days supply)"
                value={stats.criticalLocations}
                change={stats.criticalLocations > 10 ? 12 : -15}
                changeLabel="vs last week"
              />
        </div>

        {/* Main Content Area */}
        {renderContent()}
      </div>
    </div>
  );
}
