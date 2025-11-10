//todo: remove mock functionality
import type { Location, ServiceSummary, MachineTypeSummary, Recommendation, LevelLoadSuggestion } from '@shared/schema';

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearby locations with excess supply for level-loading
function findLevelLoadSources(
  targetLocation: Location, 
  allLocations: Location[], 
  maxDistance: number = 500
): LevelLoadSuggestion[] {
  const healthyLocations = allLocations.filter(loc => 
    loc.status === 'healthy' && 
    loc.id !== targetLocation.id &&
    loc.daysRemaining > 10 // Has excess supply
  );

  const nearbyWithDistance = healthyLocations.map(loc => ({
    location: loc,
    distance: calculateDistance(targetLocation.lat, targetLocation.lng, loc.lat, loc.lng),
    availableKits: Math.floor(loc.testKitsInStock - (loc.weeklyBurnRate * 10 / 7)) // Excess beyond 10 days
  }))
  .filter(item => item.distance <= maxDistance && item.availableKits > 200)
  .sort((a, b) => a.distance - b.distance)
  .slice(0, 3); // Top 3 nearest

  return nearbyWithDistance.map(item => ({
    sourceName: item.location.name,
    sourceCity: item.location.city,
    availableKits: item.availableKits,
    distanceMiles: Math.round(item.distance)
  }));
}

const dodBases = [
  // CONUS Bases
  { name: 'Fort Bragg', location: 'NC', country: 'USA', lat: 35.1390, lng: -79.0060, region: 'CONUS' },
  { name: 'Fort Campbell', location: 'KY', country: 'USA', lat: 36.6583, lng: -87.4639, region: 'CONUS' },
  { name: 'Fort Hood', location: 'TX', country: 'USA', lat: 31.1350, lng: -97.7759, region: 'CONUS' },
  { name: 'Fort Benning', location: 'GA', country: 'USA', lat: 32.3563, lng: -84.9497, region: 'CONUS' },
  { name: 'Joint Base Lewis-McChord', location: 'WA', country: 'USA', lat: 47.0979, lng: -122.5761, region: 'CONUS' },
  { name: 'Camp Pendleton', location: 'CA', country: 'USA', lat: 33.3006, lng: -117.3144, region: 'CONUS' },
  { name: 'Twentynine Palms', location: 'CA', country: 'USA', lat: 34.2964, lng: -116.1694, region: 'CONUS' },
  { name: 'Fort Bliss', location: 'TX', country: 'USA', lat: 31.8139, lng: -106.4264, region: 'CONUS' },
  { name: 'Fort Carson', location: 'CO', country: 'USA', lat: 38.7353, lng: -104.7850, region: 'CONUS' },
  { name: 'Fort Stewart', location: 'GA', country: 'USA', lat: 31.8696, lng: -81.6090, region: 'CONUS' },
  { name: 'Naval Station Norfolk', location: 'VA', country: 'USA', lat: 36.9465, lng: -76.3284, region: 'CONUS' },
  { name: 'Naval Base San Diego', location: 'CA', country: 'USA', lat: 32.6814, lng: -117.1203, region: 'CONUS' },
  { name: 'NAS Pensacola', location: 'FL', country: 'USA', lat: 30.3529, lng: -87.3072, region: 'CONUS' },
  { name: 'Eglin AFB', location: 'FL', country: 'USA', lat: 30.4833, lng: -86.5250, region: 'CONUS' },
  { name: 'Luke AFB', location: 'AZ', country: 'USA', lat: 33.5350, lng: -112.3833, region: 'CONUS' },
  { name: 'Nellis AFB', location: 'NV', country: 'USA', lat: 36.2361, lng: -115.0344, region: 'CONUS' },
  { name: 'Wright-Patterson AFB', location: 'OH', country: 'USA', lat: 39.8261, lng: -84.0483, region: 'CONUS' },
  { name: 'Peterson SFB', location: 'CO', country: 'USA', lat: 38.8125, lng: -104.7006, region: 'CONUS' },
  { name: 'Travis AFB', location: 'CA', country: 'USA', lat: 38.2627, lng: -121.9270, region: 'CONUS' },
  { name: 'McChord Field', location: 'WA', country: 'USA', lat: 47.1377, lng: -122.4764, region: 'CONUS' },
  // OCONUS Bases
  { name: 'Ramstein AB', location: 'Germany', country: 'Germany', lat: 49.4369, lng: 7.6003, region: 'OCONUS' },
  { name: 'RAF Lakenheath', location: 'UK', country: 'UK', lat: 52.4093, lng: 0.5610, region: 'OCONUS' },
  { name: 'Spangdahlem AB', location: 'Germany', country: 'Germany', lat: 49.9727, lng: 6.6925, region: 'OCONUS' },
  { name: 'Camp Humphreys', location: 'South Korea', country: 'South Korea', lat: 36.9676, lng: 127.0369, region: 'OCONUS' },
  { name: 'Kadena AB', location: 'Japan', country: 'Japan', lat: 26.3556, lng: 127.7678, region: 'OCONUS' },
  { name: 'Yokota AB', location: 'Japan', country: 'Japan', lat: 35.7485, lng: 139.3486, region: 'OCONUS' },
  { name: 'Misawa AB', location: 'Japan', country: 'Japan', lat: 40.7032, lng: 141.3683, region: 'OCONUS' },
  { name: 'Incirlik AB', location: 'Turkey', country: 'Turkey', lat: 37.0021, lng: 35.4259, region: 'OCONUS' },
  { name: 'Al Udeid AB', location: 'Qatar', country: 'Qatar', lat: 25.1173, lng: 51.3150, region: 'OCONUS' },
  { name: 'Camp Lemonnier', location: 'Djibouti', country: 'Djibouti', lat: 11.5450, lng: 43.1594, region: 'OCONUS' },
  { name: 'Naval Support Activity Naples', location: 'Italy', country: 'Italy', lat: 40.8218, lng: 14.0531, region: 'OCONUS' },
  { name: 'Naval Air Station Sigonella', location: 'Italy', country: 'Italy', lat: 37.4017, lng: 14.9225, region: 'OCONUS' },
  { name: 'Aviano AB', location: 'Italy', country: 'Italy', lat: 46.0319, lng: 12.5965, region: 'OCONUS' },
  { name: 'Osan AB', location: 'South Korea', country: 'South Korea', lat: 37.0906, lng: 127.0297, region: 'OCONUS' },
  { name: 'Naval Base Guam', location: 'Guam', country: 'Guam', lat: 13.4443, lng: 144.7937, region: 'OCONUS' },
  { name: 'Anderson AFB', location: 'Guam', country: 'Guam', lat: 13.5840, lng: 144.9306, region: 'OCONUS' },
  { name: 'RAF Mildenhall', location: 'UK', country: 'UK', lat: 52.3619, lng: 0.4864, region: 'OCONUS' },
  { name: 'RAF Croughton', location: 'UK', country: 'UK', lat: 51.9908, lng: -1.1906, region: 'OCONUS' },
  { name: 'Rota Naval Station', location: 'Spain', country: 'Spain', lat: 36.6453, lng: -6.3494, region: 'OCONUS' },
  { name: 'Camp Foster', location: 'Japan', country: 'Japan', lat: 26.2833, lng: 127.7500, region: 'OCONUS' },
];

const services = ['Army Medical', 'Navy Medicine', 'Air Force Medical', 'Marine Corps Health', 'Defense Health Agency'];
const machineTypes = ['Cepheid', 'Roche', 'Abbott ID', 'Binax Now', 'TaqPath', 'Panther', 'Panther Fusion'];

function getStatus(daysRemaining: number): Location['status'] {
  if (daysRemaining < 3) return 'critical';
  if (daysRemaining < 7) return 'warning';
  return 'healthy';
}

export function generateLocations(count: number = 133): Location[] {
  const locations: Location[] = [];
  const baseCount = dodBases.length;
  
  // Target totals: burn 50k/week, have 44k on hand
  const targetTotalStock = 44000;
  const targetWeeklyBurn = 50000;
  
  // Distribution: 30% critical, 45% warning, 25% healthy
  const criticalCount = Math.floor(count * 0.30); // ~40
  const warningCount = Math.floor(count * 0.45);  // ~60
  const healthyCount = count - criticalCount - warningCount; // ~33
  
  let totalStock = 0;
  let totalBurn = 0;
  
  for (let i = 0; i < count; i++) {
    const base = dodBases[i % baseCount];
    const facilityNum = Math.floor(i / baseCount) + 1;
    
    // Calculate remaining targets
    const remainingLocations = count - i;
    const remainingStock = targetTotalStock - totalStock;
    const remainingBurn = targetWeeklyBurn - totalBurn;
    
    // Average targets with some variance
    const avgStockNeeded = remainingStock / remainingLocations;
    const avgBurnNeeded = remainingBurn / remainingLocations;
    
    const weeklyBurnRate = Math.max(200, Math.floor(avgBurnNeeded + (Math.random() - 0.5) * 150));
    
    // Determine status based on distribution
    let status: Location['status'];
    let testKitsInStock: number;
    let daysRemaining: number;
    
    if (i < criticalCount) {
      // Critical: <3 days remaining
      // daysRemaining = (stock / burnRate) * 7 < 3
      // stock < (burnRate * 3) / 7
      daysRemaining = Math.floor(Math.random() * 2) + 1; // 1-2 days
      testKitsInStock = Math.floor((weeklyBurnRate * daysRemaining) / 7);
      status = 'critical';
    } else if (i < criticalCount + warningCount) {
      // Warning: 3-7 days remaining
      daysRemaining = Math.floor(Math.random() * 4) + 3; // 3-6 days
      testKitsInStock = Math.floor((weeklyBurnRate * daysRemaining) / 7);
      status = 'warning';
    } else {
      // Healthy: 7+ days remaining
      daysRemaining = Math.floor(Math.random() * 14) + 7; // 7-20 days
      testKitsInStock = Math.floor((weeklyBurnRate * daysRemaining) / 7);
      status = 'healthy';
    }
    
    totalStock += testKitsInStock;
    totalBurn += weeklyBurnRate;
    
    const facilityType = facilityNum === 1 ? 'Medical Center' : facilityNum === 2 ? 'Health Clinic' : facilityNum === 3 ? 'Testing Facility' : `Facility ${facilityNum}`;
    
    locations.push({
      id: `loc-${i + 1}`,
      name: `${base.name} ${facilityType}`,
      city: base.location,
      country: base.country,
      service: services[Math.floor(Math.random() * services.length)],
      machineType: machineTypes[Math.floor(Math.random() * machineTypes.length)],
      testKitsInStock,
      weeklyBurnRate,
      daysRemaining,
      infectionRate: Math.random() * 0.15,
      weeklyTestsCompleted: weeklyBurnRate, // Using burn rate as tests completed
      lat: base.lat + (Math.random() - 0.5) * 0.1,
      lng: base.lng + (Math.random() - 0.5) * 0.1,
      status,
    });
  }
  
  console.log(`Generated ${count} locations:`);
  console.log(`Total stock: ${totalStock.toLocaleString()} kits`);
  console.log(`Total weekly burn: ${totalBurn.toLocaleString()} kits/week`);
  console.log(`Critical: ${criticalCount}, Warning: ${warningCount}, Healthy: ${healthyCount}`);
  
  return locations;
}

export function generateServiceSummaries(locations: Location[]): ServiceSummary[] {
  const serviceMap = new Map<string, ServiceSummary>();
  
  locations.forEach(loc => {
    if (!serviceMap.has(loc.service)) {
      serviceMap.set(loc.service, {
        service: loc.service,
        totalLocations: 0,
        totalTestKits: 0,
        weeklyTests: 0,
        avgDaysRemaining: 0,
        healthyCount: 0,
        warningCount: 0,
        criticalCount: 0,
      });
    }
    
    const summary = serviceMap.get(loc.service)!;
    summary.totalLocations++;
    summary.totalTestKits += loc.testKitsInStock;
    summary.weeklyTests += loc.weeklyTestsCompleted;
    summary.avgDaysRemaining += loc.daysRemaining;
    
    if (loc.status === 'healthy') summary.healthyCount++;
    else if (loc.status === 'warning') summary.warningCount++;
    else summary.criticalCount++;
  });
  
  return Array.from(serviceMap.values()).map(s => ({
    ...s,
    avgDaysRemaining: Math.round(s.avgDaysRemaining / s.totalLocations),
  }));
}

export function generateMachineTypeSummaries(locations: Location[]): MachineTypeSummary[] {
  const machineMap = new Map<string, MachineTypeSummary>();
  
  locations.forEach(loc => {
    if (!machineMap.has(loc.machineType)) {
      machineMap.set(loc.machineType, {
        machineType: loc.machineType,
        totalLocations: 0,
        totalTestKits: 0,
        weeklyTests: 0,
        avgBurnRate: 0,
        avgDaysRemaining: 0,
        healthyCount: 0,
        warningCount: 0,
        criticalCount: 0,
        locations: [],
      });
    }
    
    const summary = machineMap.get(loc.machineType)!;
    summary.totalLocations++;
    summary.totalTestKits += loc.testKitsInStock;
    summary.weeklyTests += loc.weeklyTestsCompleted;
    summary.avgBurnRate += loc.weeklyBurnRate;
    summary.avgDaysRemaining += loc.daysRemaining;
    
    if (loc.status === 'healthy') summary.healthyCount++;
    else if (loc.status === 'warning') summary.warningCount++;
    else summary.criticalCount++;
    
    summary.locations.push({
      name: loc.name,
      city: loc.city,
      status: loc.status,
      testKitsInStock: loc.testKitsInStock,
    });
  });
  
  return Array.from(machineMap.values()).map(m => ({
    ...m,
    avgBurnRate: Math.round(m.avgBurnRate / m.totalLocations),
    avgDaysRemaining: Math.round(m.avgDaysRemaining / m.totalLocations),
  }));
}

// Machine type to supplier mapping
const machineTypeSuppliers: Record<string, string> = {
  'Cepheid': 'Cepheid (Danaher Corporation)',
  'Roche': 'Roche Diagnostics',
  'Abbott ID': 'Abbott Laboratories',
  'Binax Now': 'Abbott Rapid Diagnostics',
  'TaqPath': 'Thermo Fisher Scientific',
  'Panther': 'Hologic Inc.',
  'Panther Fusion': 'Hologic Inc.',
};

export function generateRecommendations(locations: Location[]): Recommendation[] {
  const critical = locations.filter(l => l.status === 'critical');
  const warning = locations.filter(l => l.status === 'warning');
  
  const recommendations: Recommendation[] = [];
  
  // Generate urgent recommendations for critical locations with level-load suggestions
  if (critical.length > 0) {
    const sorted = [...critical].sort((a, b) => a.daysRemaining - b.daysRemaining);
    sorted.slice(0, 7).forEach((loc, i) => {
      const resupplyAmount = loc.testKitsInStock < 200 ? 500 : 600;
      const levelLoadSuggestions = findLevelLoadSources(loc, locations);
      
      // If no level-load sources, provide a purchase suggestion
      const purchaseSuggestion = levelLoadSuggestions.length === 0 && loc.machineType
        ? `Purchase additional ${loc.machineType} test kits from ${machineTypeSuppliers[loc.machineType] || 'authorized supplier'}`
        : undefined;
      
      recommendations.push({
        id: `rec-${i + 1}`,
        priority: 'urgent',
        title: `${loc.name} needs ${resupplyAmount} test kits`,
        description: `${loc.daysRemaining}d supply remaining • Stock: ${loc.testKitsInStock} kits • Burn: ${loc.weeklyBurnRate}/wk`,
        affectedLocations: [loc.id],
        category: 'supply',
        resupplyAmount,
        levelLoadSuggestions: levelLoadSuggestions.length > 0 ? levelLoadSuggestions : undefined,
        purchaseSuggestion,
        machineType: loc.machineType,
      });
    });
  }
  
  // Generate high priority recommendations for regions needing coordination
  const regionMap = new Map<string, Location[]>();
  locations.forEach(loc => {
    const region = loc.city.split(' ')[0];
    if (!regionMap.has(region)) regionMap.set(region, []);
    regionMap.get(region)!.push(loc);
  });
  
  let regionRecCount = 0;
  Array.from(regionMap.entries()).forEach(([region, locs], i) => {
    const needsSupply = locs.filter(l => l.status !== 'healthy');
    if (needsSupply.length >= 3 && regionRecCount < 2) {
      recommendations.push({
        id: `rec-agg-${i + 1}`,
        priority: 'high',
        title: `${region}: ${needsSupply.length} locations need coordination`,
        description: `Regional supply coordination needed for ${region}`,
        affectedLocations: needsSupply.map(l => l.id),
        category: 'logistics',
      });
      regionRecCount++;
    }
  });
  
  // Generate medium priority recommendation for capacity balancing
  const highCapacity = locations.filter(l => l.weeklyTestsCompleted > 600);
  if (highCapacity.length > 0 && recommendations.length < 10) {
    recommendations.push({
      id: 'rec-capacity-1',
      priority: 'medium',
      title: `${highCapacity.length} locations at high capacity`,
      description: `Consider redistributing testing load to optimize resource utilization`,
      affectedLocations: highCapacity.slice(0, 4).map(l => l.id),
      category: 'capacity',
    });
  }
  
  // Sort by priority and limit to top 10
  const sorted = recommendations.sort((a, b) => {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  return sorted.slice(0, 10);
}
