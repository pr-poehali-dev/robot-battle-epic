import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Robot } from './types';

interface RobotCardProps {
  robot: Robot;
  isSelected: boolean;
  onClick: () => void;
}

export default function RobotCard({ robot, isSelected, onClick }: RobotCardProps) {
  return (
    <Card 
      className={`metal-texture cursor-pointer transition-all ${
        isSelected ? 'border-primary glow-blue' : 'border-border hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <div className="p-4">
        <Badge className="mb-2">Уровень {robot.level}</Badge>
        <img src={robot.image} alt={robot.name} className="w-full h-64 object-cover rounded-lg mb-4" />
        <h3 className="text-2xl font-bold mb-3">{robot.name}</h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Здоровье</span>
              <span>{robot.health}/{robot.maxHealth}</span>
            </div>
            <Progress value={(robot.health / robot.maxHealth) * 100} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-background/50 rounded p-2">
              <Icon name="Sword" className="mx-auto mb-1 text-red-500" size={20} />
              <div className="text-xl font-bold">{robot.attack}</div>
              <div className="text-xs text-muted-foreground">Атака</div>
            </div>
            <div className="bg-background/50 rounded p-2">
              <Icon name="Shield" className="mx-auto mb-1 text-blue-500" size={20} />
              <div className="text-xl font-bold">{robot.defense}</div>
              <div className="text-xs text-muted-foreground">Защита</div>
            </div>
            <div className="bg-background/50 rounded p-2">
              <Icon name="Zap" className="mx-auto mb-1 text-yellow-500" size={20} />
              <div className="text-xl font-bold">{robot.speed}</div>
              <div className="text-xs text-muted-foreground">Скорость</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
