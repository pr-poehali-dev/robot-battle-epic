import RobotCard from './RobotCard';
import { Robot } from './types';

interface GarageScreenProps {
  robots: Robot[];
  selectedRobot: number;
  onSelectRobot: (id: number) => void;
}

export default function GarageScreen({ robots, selectedRobot, onSelectRobot }: GarageScreenProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold text-center mb-8">ГАРАЖ РОБОТОВ</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {robots.map((robot) => (
          <RobotCard
            key={robot.id}
            robot={robot}
            isSelected={selectedRobot === robot.id}
            onClick={() => onSelectRobot(robot.id)}
          />
        ))}
      </div>
    </div>
  );
}
