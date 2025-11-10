//todo: remove mock functionality
import { MachineTypeSummary } from '../MachineTypeSummary';
import { generateLocations, generateMachineTypeSummaries } from '@/lib/mockData';

export default function MachineTypeSummaryExample() {
  const locations = generateLocations(133);
  const summaries = generateMachineTypeSummaries(locations);
  
  return (
    <div className="p-6 bg-background">
      <MachineTypeSummary summaries={summaries} />
    </div>
  );
}
