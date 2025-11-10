import { StatsCard } from '../StatsCard';
import { Package, AlertTriangle, TrendingUp, MapPin } from 'lucide-react';

export default function StatsCardExample() {
  return (
    <div className="p-6 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<MapPin className="w-6 h-6" />}
          label="Total Locations"
          value={133}
        />
        <StatsCard
          icon={<Package className="w-6 h-6" />}
          label="Total Test Kits"
          value="48.2K"
          change={5.2}
          changeLabel="vs last week"
        />
        <StatsCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Weekly Tests"
          value="52.1K"
          change={8.3}
          changeLabel="vs last week"
        />
        <StatsCard
          icon={<AlertTriangle className="w-6 h-6" />}
          label="Critical Locations"
          value={12}
          change={-15}
          changeLabel="vs last week"
        />
      </div>
    </div>
  );
}
