import { useState, useMemo, Fragment, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Globe } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { Location } from '@shared/schema';
import type { CircleMarker as LeafletCircleMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationMapProps {
  locations: Location[];
}

export function LocationMap({ locations }: LocationMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapView, setMapView] = useState<'CONUS' | 'OCONUS'>('CONUS');
  
  const getRegion = (location: Location): 'CONUS' | 'OCONUS' => {
    if (location.country === 'USA' && location.city !== 'Guam') {
      return 'CONUS';
    }
    return 'OCONUS';
  };
  
  const filteredLocations = locations.filter(loc => {
    const matchesSearch = loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = getRegion(loc) === mapView;
    return matchesSearch && matchesRegion;
  });

  // Generate heatmap data by service and health status
  const heatmapData = useMemo(() => {
    const services = ['Army Medical', 'Navy Medicine', 'Air Force Medical', 'Marine Corps Health', 'Defense Health Agency'];
    const data = services.map(service => {
      const serviceLocs = locations.filter(loc => loc.service === service);
      const critical = serviceLocs.filter(loc => loc.status === 'critical');
      const warning = serviceLocs.filter(loc => loc.status === 'warning');
      const healthy = serviceLocs.filter(loc => loc.status === 'healthy');
      
      return {
        service,
        critical: {
          count: critical.length,
          totalKits: critical.reduce((sum, loc) => sum + loc.testKitsInStock, 0)
        },
        warning: {
          count: warning.length,
          totalKits: warning.reduce((sum, loc) => sum + loc.testKitsInStock, 0)
        },
        healthy: {
          count: healthy.length,
          totalKits: healthy.reduce((sum, loc) => sum + loc.testKitsInStock, 0)
        }
      };
    });
    return data;
  }, [locations]);

  // Calculate bubble sizes based on values - smaller for better scatter
  const maxStock = useMemo(() => Math.max(...locations.map(l => l.testKitsInStock)), [locations]);
  const maxBurnRate = useMemo(() => Math.max(...locations.map(l => l.weeklyBurnRate)), [locations]);

  const getBubbleRadius = (value: number, maxValue: number, minRadius: number = 2, maxRadius: number = 12) => {
    const ratio = value / maxValue;
    return minRadius + (ratio * (maxRadius - minRadius));
  };

  // Get colors based on health status
  const getHealthColors = (status: Location['status']) => {
    switch (status) {
      case 'critical':
        return {
          dark: '#dc2626',   // Dark red for burn rate
          light: '#ef4444',  // Light red for supply
        };
      case 'warning':
        return {
          dark: '#ca8a04',   // Dark yellow for burn rate
          light: '#eab308',  // Light yellow for supply
        };
      case 'healthy':
        return {
          dark: '#16a34a',   // Dark green for burn rate
          light: '#22c55e',  // Light green for supply
        };
    }
  };

  // Add small jitter to spread overlapping locations
  const getAdjustedCoords = (lat: number, lng: number, index: number): [number, number] => {
    const jitterLat = (Math.sin(index * 2.5) * 0.08);
    const jitterLng = (Math.cos(index * 3.2) * 0.08);
    return [lat + jitterLat, lng + jitterLng];
  };

  // Calculate distance between two coordinates (simple approximation)
  const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Find nearby locations that can level-load
  const findNearbyLevelLoadLocations = (location: Location, maxDistance: number = 150): Location[] => {
    return locations
      .filter(loc => 
        loc.id !== location.id && // Not the same location
        loc.status === 'healthy' && // Has good supply
        getRegion(loc) === getRegion(location) && // Same region (CONUS/OCONUS)
        getDistance(location.lat, location.lng, loc.lat, loc.lng) <= maxDistance
      )
      .sort((a, b) => 
        getDistance(location.lat, location.lng, a.lat, a.lng) - 
        getDistance(location.lat, location.lng, b.lat, b.lng)
      )
      .slice(0, 3); // Top 3 nearest
  };

  const getStatusBadge = (status: Location['status']) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white">Healthy</Badge>;
      case 'warning': return <Badge className="bg-yellow-500 hover:bg-yellow-500 text-white">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-500 hover:bg-red-500 text-white">Critical</Badge>;
    }
  };

  const conusLocations = locations.filter(loc => getRegion(loc) === 'CONUS');
  const oconusLocations = locations.filter(loc => getRegion(loc) === 'OCONUS');

  const mapCenter: [number, number] = mapView === 'CONUS' 
    ? [39.8283, -98.5795]
    : [30.0, 20.0];
    
  const mapZoom = mapView === 'CONUS' ? 4 : 2;

  return (
    <div className="space-y-6">
      {/* Map and Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Map Controls</CardTitle>
            <div className="flex gap-2 mt-2">
              <Button
                variant={mapView === 'CONUS' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView('CONUS')}
                className="flex-1"
                data-testid="button-view-conus"
              >
                CONUS ({conusLocations.length})
              </Button>
              <Button
                variant={mapView === 'OCONUS' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMapView('OCONUS')}
                className="flex-1"
                data-testid="button-view-oconus"
              >
                OCONUS ({oconusLocations.length})
              </Button>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search bases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-locations"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground font-medium">Legend</div>
              <div className="space-y-2">
                <div className="text-xs font-medium">Health Status Colors:</div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-xs">Critical (&lt;3 days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500" />
                  <span className="text-xs">Warning (3-7 days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-xs">Healthy (7+ days)</span>
                </div>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="text-xs text-muted-foreground">Outer circle: Test kits on hand</div>
                <div className="text-xs text-muted-foreground">Inner circle: Weekly burn rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{mapView} Base Distribution</CardTitle>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{mapView === 'CONUS' ? 'Continental US' : 'Overseas Bases'}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-md overflow-hidden border-2 border-border">
              <MapContainer
                key={mapView}
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredLocations.map((loc, index) => {
                  const stockRadius = getBubbleRadius(loc.testKitsInStock, maxStock, 3, 10);
                  const burnRadius = getBubbleRadius(loc.weeklyBurnRate, maxBurnRate, 2, 6);
                  const [adjustedLat, adjustedLng] = getAdjustedCoords(loc.lat, loc.lng, index);
                  const colors = getHealthColors(loc.status);

                  return (
                    <CircleMarker
                      key={loc.id}
                      center={[adjustedLat, adjustedLng]}
                      radius={stockRadius}
                      fillColor={colors.light}
                      color={colors.dark}
                      weight={1}
                      opacity={0.8}
                      fillOpacity={0.6}
                      eventHandlers={{
                        click: (e) => {
                          e.target.openPopup();
                        }
                      }}
                    >
                        <Popup>
                          <div className="text-sm min-w-[280px] max-w-[350px] p-2">
                            <div className="bg-white rounded-lg">
                              {/* Header */}
                              <div className="border-b pb-2 mb-3">
                                <div className="font-semibold text-base">{loc.name}</div>
                                <div className="text-xs text-muted-foreground">{loc.city}, {loc.country}</div>
                              </div>

                              {/* Key Metrics */}
                              <div className="space-y-2 mb-3">
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground font-medium">Total test kits on hand:</span>
                                  <span className="font-mono font-semibold">{loc.testKitsInStock.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground font-medium">Avg weekly burn rate:</span>
                                  <span className="font-mono font-semibold">{loc.weeklyBurnRate.toLocaleString()}/wk</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground font-medium">Days remaining:</span>
                                  <span className={`font-mono font-semibold ${
                                    loc.status === 'healthy' ? 'text-green-600' :
                                    loc.status === 'warning' ? 'text-yellow-600' :
                                    'text-red-600'
                                  }`}>
                                    {loc.daysRemaining} days
                                  </span>
                                </div>
                              </div>

                              {/* Machine Types in Need of Resupply */}
                              {loc.status !== 'healthy' && (
                                <div className="border-t pt-2 mb-3">
                                  <div className="text-xs font-semibold mb-1">Machine types in need of resupply:</div>
                                  <div className="text-xs text-muted-foreground">
                                    {loc.machineType}
                                    {loc.status === 'critical' && ' (URGENT)'}
                                  </div>
                                </div>
                              )}

                              {/* Nearby Locations with Level-Load Capacity */}
                              {(() => {
                                const nearbyHealthy = findNearbyLevelLoadLocations(loc);
                                return nearbyHealthy.length > 0 ? (
                                  <div className="border-t pt-2">
                                    <div className="text-xs font-semibold mb-1">Nearby locations with ability to level-load:</div>
                                    <div className="space-y-1">
                                      {nearbyHealthy.map((nearby) => (
                                        <div key={nearby.id} className="text-xs">
                                          <span className="font-medium">{nearby.name}</span>
                                          <span className="text-muted-foreground ml-1">
                                            ({Math.round(getDistance(loc.lat, loc.lng, nearby.lat, nearby.lng))} mi)
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          </div>
                        </Popup>
                      </CircleMarker>
                  );
                })}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Locations List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Individual Locations ({filteredLocations.length})</CardTitle>
          <p className="text-sm text-muted-foreground">Detailed view of all {mapView} locations</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[400px] overflow-y-auto">
            {filteredLocations.map((loc) => (
              <button
                key={loc.id}
                className="w-full text-left px-4 py-3 border-b hover-elevate active-elevate-2 transition-colors"
                onClick={() => console.log('Location clicked:', loc.name)}
                data-testid={`button-location-${loc.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{loc.name}</div>
                    <div className="text-xs text-muted-foreground">{loc.city}, {loc.country}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono">{loc.testKitsInStock} kits</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{loc.weeklyBurnRate}/wk burn</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{loc.daysRemaining}d remaining</span>
                    </div>
                  </div>
                  {getStatusBadge(loc.status)}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
