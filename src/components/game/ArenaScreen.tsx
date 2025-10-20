import MissionCard from './MissionCard';
import { Mission } from './types';

interface ArenaScreenProps {
  missions: Mission[];
  onStartBattle: (mission: Mission) => void;
}

export default function ArenaScreen({ missions, onStartBattle }: ArenaScreenProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold text-center mb-8">АРЕНА БИТВ</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {missions.map((mission) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            onStartBattle={onStartBattle}
          />
        ))}
      </div>
    </div>
  );
}
