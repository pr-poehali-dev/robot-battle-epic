import { useState } from 'react';
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
}

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'garage' | 'arena' | 'shop'>('home');
  const [selectedRobot, setSelectedRobot] = useState<number>(0);
  const [credits, setCredits] = useState(5000);
  const [inBattle, setInBattle] = useState(false);
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);

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
    { id: 1, name: 'Патруль сектора А-7', difficulty: 'easy', reward: 500, completed: false },
    { id: 2, name: 'Защита конвоя', difficulty: 'medium', reward: 800, completed: false },
    { id: 3, name: 'Зачистка базы врага', difficulty: 'hard', reward: 1200, completed: false },
    { id: 4, name: 'БОСС: Гидра Прайм', difficulty: 'boss', reward: 3000, completed: false, boss: true },
    { id: 5, name: 'Диверсия на заводе', difficulty: 'medium', reward: 900, completed: false },
    { id: 6, name: 'БОСС: Колосс Разрушения', difficulty: 'boss', reward: 5000, completed: false, boss: true }
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
    
    setBattleLog([
      `🤖 ${robot.name} выдвигается на миссию: ${mission.name}`,
      `⚔️ Начало боя! Враг обнаружен!`,
      `💥 ${robot.name} наносит удар на ${robot.attack} урона!`,
      `🛡️ Враг контратакует, получено ${Math.floor(Math.random() * 50)} урона!`,
      `⚡ Критический удар! +${robot.attack * 1.5} урона!`,
      `🎯 Враг уничтожен!`,
      `✅ Миссия завершена успешно!`,
      `💰 Получено ${mission.reward} кредитов`
    ]);

    setTimeout(() => {
      setCredits(credits + mission.reward);
      setInBattle(false);
    }, 5000);
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
                  <Card className="metal-texture p-8">
                    <h3 className="text-2xl font-bold text-center mb-6">🔥 БОЙ ИДЁТ 🔥</h3>
                    <div className="space-y-2 bg-background/50 p-6 rounded-lg max-h-96 overflow-y-auto">
                      {battleLog.map((log, idx) => (
                        <div key={idx} className="text-lg animate-slide-in" style={{ animationDelay: `${idx * 0.5}s` }}>
                          {log}
                        </div>
                      ))}
                    </div>
                  </Card>
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