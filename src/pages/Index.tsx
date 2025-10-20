import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import HomeScreen from '@/components/game/HomeScreen';
import GarageScreen from '@/components/game/GarageScreen';
import ArenaScreen from '@/components/game/ArenaScreen';
import ShopScreen from '@/components/game/ShopScreen';
import BattleScreen from '@/components/game/BattleScreen';
import { Robot, Mission, Upgrade } from '@/components/game/types';

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

  const upgrades: Upgrade[] = [
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      {currentScreen === 'home' && (
        <HomeScreen onNavigate={setCurrentScreen} />
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

              <TabsContent value="garage">
                <GarageScreen
                  robots={robots}
                  selectedRobot={selectedRobot}
                  onSelectRobot={setSelectedRobot}
                />
              </TabsContent>

              <TabsContent value="arena">
                {!inBattle ? (
                  <ArenaScreen missions={missions} onStartBattle={startBattle} />
                ) : (
                  <BattleScreen
                    robot={robots[selectedRobot]}
                    mission={currentMission!}
                    playerHealth={playerHealth}
                    playerMaxHealth={playerMaxHealth}
                    enemyHealth={enemyHealth}
                    enemyMaxHealth={enemyMaxHealth}
                    isPlayerTurn={isPlayerTurn}
                    damageIndicator={damageIndicator}
                    shake={shake}
                    attackAnimation={attackAnimation}
                    specialReady={specialReady}
                    comboCount={comboCount}
                    shieldActive={shieldActive}
                    battleLog={battleLog}
                    onAttack={performAttack}
                    onSpecialAttack={performSpecialAttack}
                    onActivateShield={activateShield}
                    onExit={() => setInBattle(false)}
                  />
                )}
              </TabsContent>

              <TabsContent value="shop">
                <ShopScreen
                  upgrades={upgrades}
                  credits={credits}
                  onPurchase={(cost) => setCredits(credits - cost)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}
