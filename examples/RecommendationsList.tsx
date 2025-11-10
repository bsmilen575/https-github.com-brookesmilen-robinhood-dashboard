//todo: remove mock functionality
import { RecommendationsList } from '../RecommendationsList';
import { generateLocations, generateRecommendations } from '@/lib/mockData';

export default function RecommendationsListExample() {
  const locations = generateLocations(133);
  const recommendations = generateRecommendations(locations);
  
  return (
    <div className="p-6 bg-background">
      <RecommendationsList recommendations={recommendations.slice(0, 10)} />
    </div>
  );
}
