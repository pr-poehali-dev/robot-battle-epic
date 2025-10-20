import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Mission } from './types';

interface MissionCardProps {
  mission: Mission;
  onStartBattle: (mission: Mission) => void;
}

export default function MissionCard({ mission, onStartBattle }: MissionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'boss': return 'bg-red-500 glow-red';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="metal-texture p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">{mission.name}</h3>
          <Badge className={getDifficultyColor(mission.difficulty)}>
            {mission.boss ? '👑 БОСС' : mission.difficulty.toUpperCase()}
          </Badge>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 text-yellow-500">
            <Icon name="Coins" size={20} />
            <span className="font-bold">{mission.reward}</span>
          </div>
        </div>
      </div>
      
      <Button 
        className="w-full mt-4" 
        onClick={() => onStartBattle(mission)}
        disabled={mission.completed}
      >
        {mission.completed ? 'Завершено' : 'Начать миссию'}
      </Button>
    </Card>
  );
}
