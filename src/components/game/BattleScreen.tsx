import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Robot, Mission } from './types';

interface BattleScreenProps {
  robot: Robot;
  mission: Mission;
  playerHealth: number;
  playerMaxHealth: number;
  enemyHealth: number;
  enemyMaxHealth: number;
  isPlayerTurn: boolean;
  damageIndicator: {amount: number, type: 'player' | 'enemy'} | null;
  shake: 'player' | 'enemy' | null;
  attackAnimation: 'player' | 'enemy' | null;
  specialReady: boolean;
  comboCount: number;
  shieldActive: boolean;
  battleLog: string[];
  onAttack: () => void;
  onSpecialAttack: () => void;
  onActivateShield: () => void;
  onExit: () => void;
}

export default function BattleScreen({
  robot,
  mission,
  playerHealth,
  playerMaxHealth,
  enemyHealth,
  enemyMaxHealth,
  isPlayerTurn,
  damageIndicator,
  shake,
  attackAnimation,
  specialReady,
  comboCount,
  shieldActive,
  battleLog,
  onAttack,
  onSpecialAttack,
  onActivateShield,
  onExit
}: BattleScreenProps) {
  return (
    <div className="space-y-6">
      <Card className="metal-texture p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-destructive/5 animate-pulse-glow pointer-events-none"></div>
        
        {comboCount > 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <Badge className="text-2xl px-6 py-2 bg-yellow-500 text-black animate-pulse-glow">
              🔥 КОМБО x{comboCount}
            </Badge>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-8 mb-6 relative z-10">
          <div className={`relative transition-all duration-300 ${shake === 'player' ? 'animate-shake' : ''} ${attackAnimation === 'player' ? 'scale-110 -translate-x-8' : ''}`}>
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-primary mb-2">{robot.name}</h3>
              <Badge className="mb-2 bg-primary">ВАШ РОБОТ</Badge>
            </div>
            <div className="relative">
              {shieldActive && (
                <div className="absolute inset-0 border-4 border-blue-400 rounded-lg animate-pulse-glow bg-blue-500/20 z-10"></div>
              )}
              <img 
                src={robot.image} 
                alt={robot.name}
                className={`w-full h-72 object-cover rounded-lg border-4 border-primary glow-blue transition-all ${attackAnimation === 'player' ? 'brightness-150' : ''}`}
              />
              {damageIndicator && damageIndicator.type === 'player' && damageIndicator.amount > 0 && (
                <div className="absolute top-4 right-4 text-5xl font-black text-red-500 animate-bounce drop-shadow-[0_0_20px_rgba(239,68,68,1)]">
                  -{damageIndicator.amount}
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-primary">HP</span>
                <span className={playerHealth < playerMaxHealth * 0.3 ? 'text-red-500 animate-pulse' : ''}>{playerHealth}/{playerMaxHealth}</span>
              </div>
              <Progress value={(playerHealth / playerMaxHealth) * 100} className="h-4 glow-blue" />
            </div>
          </div>

          <div className={`relative transition-all duration-300 ${shake === 'enemy' ? 'animate-shake' : ''} ${attackAnimation === 'enemy' ? 'scale-110 translate-x-8' : ''}`}>
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-destructive mb-2">{mission.enemyName}</h3>
              <Badge className="mb-2 bg-destructive">
                {mission.boss ? '👑 БОСС' : 'ПРОТИВНИК'}
              </Badge>
            </div>
            <div className="relative">
              <img 
                src={mission.enemyImage}
                alt="Enemy"
                className={`w-full h-72 object-cover rounded-lg border-4 border-destructive glow-red transition-all ${attackAnimation === 'enemy' ? 'brightness-150' : ''}`}
              />
              {damageIndicator && damageIndicator.type === 'enemy' && (
                <div className="absolute top-4 right-4 text-5xl font-black text-yellow-500 animate-bounce drop-shadow-[0_0_20px_rgba(234,179,8,1)]">
                  -{damageIndicator.amount}
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-destructive">HP</span>
                <span className={enemyHealth < enemyMaxHealth * 0.3 ? 'text-red-500 animate-pulse' : ''}>{enemyHealth}/{enemyMaxHealth}</span>
              </div>
              <Progress value={(enemyHealth / enemyMaxHealth) * 100} className="h-4 glow-red" />
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-center mb-6 flex-wrap relative z-10">
          <Button 
            size="lg" 
            className="h-16 text-lg glow-blue flex-1 min-w-[140px]"
            onClick={onAttack}
            disabled={!isPlayerTurn || enemyHealth <= 0 || playerHealth <= 0}
          >
            <Icon name="Sword" className="mr-2" size={24} />
            {isPlayerTurn ? 'АТАКА' : 'Ход врага...'}
          </Button>
          
          <Button 
            size="lg" 
            className="h-16 text-lg bg-yellow-500 hover:bg-yellow-600 glow-orange flex-1 min-w-[140px]"
            onClick={onSpecialAttack}
            disabled={!specialReady || !isPlayerTurn || enemyHealth <= 0 || playerHealth <= 0}
          >
            <Icon name="Zap" className="mr-2" size={24} />
            {specialReady ? 'СПЕЦАТАКА' : 'Использована'}
          </Button>
          
          <Button 
            size="lg" 
            className="h-16 text-lg bg-blue-500 hover:bg-blue-600 flex-1 min-w-[140px]"
            onClick={onActivateShield}
            disabled={!isPlayerTurn || shieldActive || enemyHealth <= 0 || playerHealth <= 0}
          >
            <Icon name="Shield" className="mr-2" size={24} />
            {shieldActive ? 'ЩИТ АКТИВЕН' : 'ЩИТ'}
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="h-16 text-lg"
            onClick={onExit}
            disabled={enemyHealth > 0 && playerHealth > 0}
          >
            <Icon name="Home" className="mr-2" size={24} />
            Выйти
          </Button>
        </div>
      </Card>

      <Card className="metal-texture p-6">
        <h4 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
          <Icon name="ScrollText" size={24} />
          БОЙ-ЛОГ
        </h4>
        <div className="space-y-1 bg-background/50 p-4 rounded-lg max-h-48 overflow-y-auto">
          {battleLog.map((log, idx) => (
            <div key={idx} className="text-sm animate-slide-in opacity-90 font-mono">
              {log}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
