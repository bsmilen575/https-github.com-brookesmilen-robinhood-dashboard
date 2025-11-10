//todo: remove mock functionality
import { ServiceSummaryTable } from '../ServiceSummaryTable';
import { generateLocations, generateServiceSummaries } from '@/lib/mockData';

export default function ServiceSummaryTableExample() {
  const locations = generateLocations(133);
  const summaries = generateServiceSummaries(locations);
  
  return (
    <div className="p-6 bg-background">
      <ServiceSummaryTable summaries={summaries} />
    </div>
  );
}
