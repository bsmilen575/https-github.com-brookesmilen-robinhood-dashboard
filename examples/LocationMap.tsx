//todo: remove mock functionality
import { LocationMap } from '../LocationMap';
import { generateLocations } from '@/lib/mockData';

export default function LocationMapExample() {
  const locations = generateLocations(133);
  
  return (
    <div className="p-6 bg-background">
      <LocationMap locations={locations} />
    </div>
  );
}
