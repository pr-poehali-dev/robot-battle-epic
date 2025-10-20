import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Robot {
  id: number;
  name: string;
  image: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
}

interface Mission {
  id: number;
  name: string;
  difficulty: string;
  reward: number;
  completed: boolean;
  boss?: boolean;
  enemyImage: string;
  enemyName: string;
}

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'garage' | 'arena' | 'shop'>('home');
  const [selectedRobot, setSelectedRobot] = useState<number>(0);
  const [credits, setCredits] = useState(5000);
  const [inBattle, setInBattle] = useState(false);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [playerHealth, setPlayerHealth] = useState(1000);
  const [enemyHealth, setEnemyHealth] = useState(1000);
  const [playerMaxHealth, setPlayerMaxHealth] = useState(1000);
  const [enemyMaxHealth, setEnemyMaxHealth] = useState(1000);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [damageIndicator, setDamageIndicator] = useState<{amount: number, type: 'player' | 'enemy'} | null>(null);
  const [shake, setShake] = useState<'player' | 'enemy' | null>(null);
  const [attackAnimation, setAttackAnimation] = useState<'player' | 'enemy' | null>(null);
  const [specialReady, setSpecialReady] = useState(true);
  const [comboCount, setComboCount] = useState(0);
  const [shieldActive, setShieldActive] = useState(false);

  const robots: Robot[] = [
    {
      id: 0,
      name: 'Страж Нова',
      image: 'https://cdn.poehali.dev/projects/c3045d3a-33e5-42fa-829f-707b67371ce0/files/dd17483c-205c-4440-bc63-846f08b1293f.jpg',
      health: 1000,
      maxHealth: 1000,
      attack: 120,
      defense: 80,
      speed: 65,
      level: 5
    },
    {
      id: 1,
      name: 'Штурмовик Титан',
      image: 'https://cdn.poehali.dev/projects/c3045d3a-33e5-42fa-829f-707b67371ce0/files/31ca1370-0619-4d5b-ad97-5288f59d150f.jpg',
      health: 1200,
      maxHealth: 1200,
      attack: 150,
      defense: 100,
      speed: 45,
      level: 7
    },
    {
      id: 2,
      name: 'Разрушитель Омега',
      image: 'https://cdn.poehali.dev/projects/c3045d3a-33e5-42fa-829f-707b67371ce0/files/28f18d64-bbe2-44f1-a9ec-948c7ddd0301.jpg',
      health: 800,
      maxHealth: 800,
      attack: 180,
      defense: 60,
      speed: 85,
      level: 6
    }
  ];

  const missions: Mission[] = [
    { id: 1, name: 'Патруль сектора А-7', difficulty: 'easy', reward: 500, completed: false, enemyImage: 'https://cdn.poehali.dev/projects/c3045d3a-33e5-42fa-829f-707b67371ce0/files/76eaa5c1-676f-4708-ad58-6163ff2668f0.jpg', enemyName: 'Разведчик МК-1' },
    { id: 2, name: 'Защита конвоя', difficulty: 'medium', reward: 800, completed: false, enemyImage: 'https://cdn.poehali.dev/projects/c3045d3a-33e5-42fa-829f-707b67371ce0/files/76eaa5c1-676f-4708-ad58-6163ff2668f0.jpg', enemyName: 'Патрульный дрон' },
    { id: 3, name: 'Зачистка базы врага', difficulty: 'hard', reward: 1200, completed: false, enemyImage: 'https://cdn.poehali.dev/projects/c3045d3a-33e5-42fa-829f-707b67371ce0/files/967d23b6-b918-49e4-b3f0-2e252e1174bc.jpg', enemyName: 'Штурмовой танк' },
    { id: 4, name: 'БОСС: Гидра Прайм', difficulty: 'boss', reward: 3000, completed: false, boss: true, enemyImage: 'https://cdn.poehali.dev/projects/c3045d3a-33e5-42fa-829f-707b67371ce0/files/d1a72049-1469-4705-ae2c-3cbfe1808fa7.jpg', enemyName: '👑 Гидра Прайм' },
    { id: 5, name: 'Диверсия на заводе', difficulty: 'medium', reward: 900, completed: false, enemyImage: 'https://cdn.poehali.dev/projects/c3045d3a-33e5-42fa-829f-707b67371ce0/files/f4ea8191-510b-4bdd-bed3-bf8783301efb.jpg', enemyName: 'Элитный охранник' },
    { id: 6, name: 'БОСС: Колосс Разрушения', difficulty: 'boss', reward: 5000, completed: false, boss: true, enemyImage: 'https://cdn.poehali.dev/projects/c3045d3a-33e5-42fa-829f-707b67371ce0/files/37a82f80-0a72-402d-93f9-9c9357246e55.jpg', enemyName: '👑 Колосс Разрушения' }
  ];

  const upgrades = [
    { id: 1, name: 'Усиленная броня', cost: 1000, stat: 'defense', value: 20 },
    { id: 2, name: 'Плазменное оружие', cost: 1500, stat: 'attack', value: 30 },
    { id: 3, name: 'Ускоритель двигателя', cost: 800, stat: 'speed', value: 15 },
    { id: 4, name: 'Энергетический щит', cost: 2000, stat: 'health', value: 200 }
  ];

  const startBattle = (mission: Mission) => {
    setCurrentMission(mission);
    setInBattle(true);
    const robot = robots[selectedRobot];
    
    const enemyMaxHp = mission.boss ? 2500 : mission.difficulty === 'hard' ? 1500 : mission.difficulty === 'medium' ? 1000 : 700;
    setPlayerHealth(robot.health);
    setPlayerMaxHealth(robot.maxHealth);
    setEnemyHealth(enemyMaxHp);
    setEnemyMaxHealth(enemyMaxHp);
    setIsPlayerTurn(true);
    setComboCount(0);
    setSpecialReady(true);
    setShieldActive(false);
    setBattleLog([`⚔️ ${robot.name} VS ${mission.enemyName}`, `🎮 Используй спецатаку для мощного урона!`]);
  };

  const performAttack = () => {
    if (!isPlayerTurn || !currentMission) return;
    
    const robot = robots[selectedRobot];
    const isCrit = Math.random() > 0.7;
    let damage = isCrit ? Math.floor(robot.attack * 1.5) : robot.attack;
    
    if (comboCount > 0) {
      damage = Math.floor(damage * (1 + comboCount * 0.2));
    }
    
    const newEnemyHealth = Math.max(0, enemyHealth - damage);
    
    setAttackAnimation('player');
    setTimeout(() => {
      setEnemyHealth(newEnemyHealth);
      setShake('enemy');
      setDamageIndicator({amount: damage, type: 'enemy'});
      
      if (isCrit) {
        setComboCount(prev => Math.min(prev + 1, 3));
        setBattleLog(prev => [...prev, `⚡ КРИТИЧЕСКИЙ УДАР! ${damage} урона! КОМБО x${comboCount + 1}`]);
      } else {
        setComboCount(0);
        setBattleLog(prev => [...prev, `💥 ${robot.name} атакует: ${damage} урона`]);
      }
    }, 300);
    
    setTimeout(() => {
      setShake(null);
      setDamageIndicator(null);
      setAttackAnimation(null);
    }, 800);
    
    if (newEnemyHealth <= 0) {
      setTimeout(() => {
        setBattleLog(prev => [...prev, `🏆 ПОБЕДА! +${currentMission.reward} кредитов`]);
        setCredits(prev => prev + currentMission.reward);
        setTimeout(() => setInBattle(false), 3000);
      }, 1200);
      return;
    }
    
    setIsPlayerTurn(false);
    setTimeout(() => enemyAttack(), 2000);
  };
  
  const performSpecialAttack = () => {
    if (!specialReady || !isPlayerTurn || !currentMission) return;
    
    const robot = robots[selectedRobot];
    const specialDamage = Math.floor(robot.attack * 2.5);
    const newEnemyHealth = Math.max(0, enemyHealth - specialDamage);
    
    setSpecialReady(false);
    setAttackAnimation('player');
    
    setTimeout(() => {
      setEnemyHealth(newEnemyHealth);
      setShake('enemy');
      setDamageIndicator({amount: specialDamage, type: 'enemy'});
      setBattleLog(prev => [...prev, `🌟 СПЕЦАТАКА! ${specialDamage} урона! Враг оглушен!`]);
      setComboCount(3);
    }, 400);
    
    setTimeout(() => {
      setShake(null);
      setDamageIndicator(null);
      setAttackAnimation(null);
    }, 1000);
    
    if (newEnemyHealth <= 0) {
      setTimeout(() => {
        setBattleLog(prev => [...prev, `🏆 ЭПИЧНАЯ ПОБЕДА! +${currentMission.reward} кредитов`]);
        setCredits(prev => prev + currentMission.reward);
        setTimeout(() => setInBattle(false), 3000);
      }, 1500);
      return;
    }
    
    setIsPlayerTurn(false);
    setTimeout(() => enemyAttack(), 2500);
  };
  
  const activateShield = () => {
    if (shieldActive || !isPlayerTurn) return;
    setShieldActive(true);
    setBattleLog(prev => [...prev, `🛡️ Щит активирован! Следующая атака заблокирована!`]);
    setIsPlayerTurn(false);
    setTimeout(() => enemyAttack(), 1500);
  };

  const enemyAttack = () => {
    let enemyDamage = Math.floor(Math.random() * 80) + 50;
    
    if (currentMission?.boss) {
      enemyDamage = Math.floor(enemyDamage * 1.3);
    }
    
    setAttackAnimation('enemy');
    
    setTimeout(() => {
      if (shieldActive) {
        setBattleLog(prev => [...prev, `🛡️ ЩИТ ЗАБЛОКИРОВАЛ ${enemyDamage} урона!`]);
        setShieldActive(false);
        setDamageIndicator({amount: 0, type: 'player'});
      } else {
        const newPlayerHealth = Math.max(0, playerHealth - enemyDamage);
        setPlayerHealth(newPlayerHealth);
        setShake('player');
        setDamageIndicator({amount: enemyDamage, type: 'player'});
        setBattleLog(prev => [...prev, `🔥 ${currentMission?.enemyName} атакует: ${enemyDamage} урона!`]);
        
        if (newPlayerHealth <= 0) {
          setTimeout(() => {
            setBattleLog(prev => [...prev, `💀 ПОРАЖЕНИЕ... Попробуй снова!`]);
            setTimeout(() => setInBattle(false), 2500);
          }, 1000);
          return;
        }
      }
    }, 400);
    
    setTimeout(() => {
      setShake(null);
      setDamageIndicator(null);
      setAttackAnimation(null);
      setIsPlayerTurn(true);
    }, 1000);
  };

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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {currentScreen === 'home' && (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDE0LCAxNjUsIDIzMywgMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          
          <div className="relative z-10 text-center space-y-8 animate-slide-in">
            <h1 className="text-7xl font-black text-primary drop-shadow-[0_0_30px_rgba(14,165,233,0.7)]">
              ROBOT WARS
            </h1>
            <p className="text-2xl text-muted-foreground">ЭПИЧНЫЕ БИТВЫ РОБОТОВ</p>
            
            <div className="mt-12 space-y-4">
              <Button 
                size="lg" 
                className="w-64 h-16 text-xl glow-blue animate-pulse-glow"
                onClick={() => setCurrentScreen('garage')}
              >
                <Icon name="Play" className="mr-2" size={24} />
                НАЧАТЬ ИГРУ
              </Button>
              
              <div className="flex gap-4 justify-center mt-8">
                <Card className="p-6 metal-texture border-primary/30 hover:border-primary transition-all cursor-pointer" onClick={() => setCurrentScreen('garage')}>
                  <Icon name="Wrench" className="mx-auto mb-2 text-primary" size={32} />
                  <p className="text-sm">Гараж</p>
                </Card>
                <Card className="p-6 metal-texture border-primary/30 hover:border-primary transition-all cursor-pointer" onClick={() => setCurrentScreen('arena')}>
                  <Icon name="Swords" className="mx-auto mb-2 text-secondary" size={32} />
                  <p className="text-sm">Арена</p>
                </Card>
                <Card className="p-6 metal-texture border-primary/30 hover:border-primary transition-all cursor-pointer" onClick={() => setCurrentScreen('shop')}>
                  <Icon name="ShoppingCart" className="mx-auto mb-2 text-yellow-500" size={32} />
                  <p className="text-sm">Магазин</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentScreen !== 'home' && (
        <div className="min-h-screen p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Button variant="outline" onClick={() => setCurrentScreen('home')}>
                <Icon name="Home" className="mr-2" size={20} />
                Главная
              </Button>
              <div className="flex items-center gap-2 text-xl font-bold">
                <Icon name="Coins" className="text-yellow-500" size={24} />
                {credits} кредитов
              </div>
            </div>

            <Tabs value={currentScreen} onValueChange={(v) => setCurrentScreen(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="garage" className="text-lg">
                  <Icon name="Wrench" className="mr-2" size={20} />
                  Гараж
                </TabsTrigger>
                <TabsTrigger value="arena" className="text-lg">
                  <Icon name="Swords" className="mr-2" size={20} />
                  Арена
                </TabsTrigger>
                <TabsTrigger value="shop" className="text-lg">
                  <Icon name="ShoppingCart" className="mr-2" size={20} />
                  Магазин
                </TabsTrigger>
              </TabsList>

              <TabsContent value="garage" className="space-y-6">
                <h2 className="text-4xl font-bold text-center mb-8">ГАРАЖ РОБОТОВ</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {robots.map((robot) => (
                    <Card 
                      key={robot.id}
                      className={`metal-texture cursor-pointer transition-all ${
                        selectedRobot === robot.id ? 'border-primary glow-blue' : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedRobot(robot.id)}
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
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="arena" className="space-y-6">
                <h2 className="text-4xl font-bold text-center mb-8">АРЕНА БИТВ</h2>
                
                {!inBattle ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {missions.map((mission) => (
                      <Card key={mission.id} className="metal-texture p-6">
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
                          onClick={() => startBattle(mission)}
                          disabled={mission.completed}
                        >
                          {mission.completed ? 'Завершено' : 'Начать миссию'}
                        </Button>
                      </Card>
                    ))}
                  </div>
                ) : (
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
                            <h3 className="text-2xl font-bold text-primary mb-2">{robots[selectedRobot].name}</h3>
                            <Badge className="mb-2 bg-primary">ВАШ РОБОТ</Badge>
                          </div>
                          <div className="relative">
                            {shieldActive && (
                              <div className="absolute inset-0 border-4 border-blue-400 rounded-lg animate-pulse-glow bg-blue-500/20 z-10"></div>
                            )}
                            <img 
                              src={robots[selectedRobot].image} 
                              alt={robots[selectedRobot].name}
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
                            <h3 className="text-2xl font-bold text-destructive mb-2">{currentMission?.enemyName}</h3>
                            <Badge className="mb-2 bg-destructive">
                              {currentMission?.boss ? '👑 БОСС' : 'ПРОТИВНИК'}
                            </Badge>
                          </div>
                          <div className="relative">
                            <img 
                              src={currentMission?.enemyImage}
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
                          onClick={performAttack}
                          disabled={!isPlayerTurn || enemyHealth <= 0 || playerHealth <= 0}
                        >
                          <Icon name="Sword" className="mr-2" size={24} />
                          {isPlayerTurn ? 'АТАКА' : 'Ход врага...'}
                        </Button>
                        
                        <Button 
                          size="lg" 
                          className="h-16 text-lg bg-yellow-500 hover:bg-yellow-600 glow-orange flex-1 min-w-[140px]"
                          onClick={performSpecialAttack}
                          disabled={!specialReady || !isPlayerTurn || enemyHealth <= 0 || playerHealth <= 0}
                        >
                          <Icon name="Zap" className="mr-2" size={24} />
                          {specialReady ? 'СПЕЦАТАКА' : 'Использована'}
                        </Button>
                        
                        <Button 
                          size="lg" 
                          className="h-16 text-lg bg-blue-500 hover:bg-blue-600 flex-1 min-w-[140px]"
                          onClick={activateShield}
                          disabled={!isPlayerTurn || shieldActive || enemyHealth <= 0 || playerHealth <= 0}
                        >
                          <Icon name="Shield" className="mr-2" size={24} />
                          {shieldActive ? 'ЩИТ АКТИВЕН' : 'ЩИТ'}
                        </Button>
                        
                        <Button 
                          size="lg" 
                          variant="outline"
                          className="h-16 text-lg"
                          onClick={() => setInBattle(false)}
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
                )}
              </TabsContent>

              <TabsContent value="shop" className="space-y-6">
                <h2 className="text-4xl font-bold text-center mb-8">МАГАЗИН УЛУЧШЕНИЙ</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {upgrades.map((upgrade) => (
                    <Card key={upgrade.id} className="metal-texture p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{upgrade.name}</h3>
                          <p className="text-muted-foreground">
                            +{upgrade.value} к {upgrade.stat === 'attack' ? 'атаке' : upgrade.stat === 'defense' ? 'защите' : upgrade.stat === 'speed' ? 'скорости' : 'здоровью'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-500 text-xl font-bold">
                          <Icon name="Coins" size={24} />
                          {upgrade.cost}
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          if (credits >= upgrade.cost) {
                            setCredits(credits - upgrade.cost);
                          }
                        }}
                        disabled={credits < upgrade.cost}
                      >
                        {credits >= upgrade.cost ? 'Купить' : 'Недостаточно кредитов'}
                      </Button>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}