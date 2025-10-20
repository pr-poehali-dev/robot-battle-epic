import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface HomeScreenProps {
  onNavigate: (screen: 'garage' | 'arena' | 'shop') => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
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
            onClick={() => onNavigate('garage')}
          >
            <Icon name="Play" className="mr-2" size={24} />
            НАЧАТЬ ИГРУ
          </Button>
          
          <div className="flex gap-4 justify-center mt-8">
            <Card 
              className="p-6 metal-texture border-primary/30 hover:border-primary transition-all cursor-pointer" 
              onClick={() => onNavigate('garage')}
            >
              <Icon name="Wrench" className="mx-auto mb-2 text-primary" size={32} />
              <p className="text-sm">Гараж</p>
            </Card>
            <Card 
              className="p-6 metal-texture border-primary/30 hover:border-primary transition-all cursor-pointer" 
              onClick={() => onNavigate('arena')}
            >
              <Icon name="Swords" className="mx-auto mb-2 text-secondary" size={32} />
              <p className="text-sm">Арена</p>
            </Card>
            <Card 
              className="p-6 metal-texture border-primary/30 hover:border-primary transition-all cursor-pointer" 
              onClick={() => onNavigate('shop')}
            >
              <Icon name="ShoppingCart" className="mx-auto mb-2 text-yellow-500" size={32} />
              <p className="text-sm">Магазин</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
