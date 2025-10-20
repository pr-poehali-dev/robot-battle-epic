import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Upgrade } from './types';

interface ShopScreenProps {
  upgrades: Upgrade[];
  credits: number;
  onPurchase: (cost: number) => void;
}

export default function ShopScreen({ upgrades, credits, onPurchase }: ShopScreenProps) {
  const getStatName = (stat: string) => {
    switch (stat) {
      case 'attack': return 'атаке';
      case 'defense': return 'защите';
      case 'speed': return 'скорости';
      case 'health': return 'здоровью';
      default: return stat;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold text-center mb-8">МАГАЗИН УЛУЧШЕНИЙ</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {upgrades.map((upgrade) => (
          <Card key={upgrade.id} className="metal-texture p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{upgrade.name}</h3>
                <p className="text-muted-foreground">
                  +{upgrade.value} к {getStatName(upgrade.stat)}
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
                  onPurchase(upgrade.cost);
                }
              }}
              disabled={credits < upgrade.cost}
            >
              {credits >= upgrade.cost ? 'Купить' : 'Недостаточно кредитов'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
