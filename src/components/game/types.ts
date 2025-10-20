export interface Robot {
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

export interface Mission {
  id: number;
  name: string;
  difficulty: string;
  reward: number;
  completed: boolean;
  boss?: boolean;
  enemyImage: string;
  enemyName: string;
}

export interface Upgrade {
  id: number;
  name: string;
  cost: number;
  stat: string;
  value: number;
}
