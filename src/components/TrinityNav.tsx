import React from 'react';
import { cn } from '@/lib/utils';

export type TrinityPath = 'all' | 'sound' | 'body' | 'flow';

interface TrinityNavProps {
  activePath: TrinityPath;
  onPathChange: (path: TrinityPath) => void;
  className?: string;
}

const paths: { id: TrinityPath; label: string; icon: string; description: string }[] = [
  { id: 'all', label: 'All Paths', icon: '☯', description: 'Complete Journey' },
  { id: 'sound', label: 'Sound', icon: '🐚', description: 'Nada · Vibration' },
  { id: 'body', label: 'Body', icon: '⚡', description: 'Kaya · Structure' },
  { id: 'flow', label: 'Flow', icon: '🌀', description: 'Prana · Breath' },
];

const TrinityNav: React.FC<TrinityNavProps> = ({ activePath, onPathChange, className }) => {
  return (
    <div className={cn("flex flex-wrap justify-center gap-3 md:gap-4", className)}>
      {paths.map((path) => (
        <button
          key={path.id}
          onClick={() => onPathChange(path.id)}
          className={cn(
            "group relative flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300",
            "border-2 min-w-[100px] md:min-w-[140px]",
            activePath === path.id
              ? "bg-primary border-primary text-primary-foreground shadow-cosmic"
              : "bg-card border-border text-foreground hover:border-saffron hover:shadow-lg"
          )}
        >
          <span className="text-2xl md:text-3xl transition-transform group-hover:scale-110">
            {path.icon}
          </span>
          <span className="font-display text-sm md:text-base tracking-wider">
            {path.label}
          </span>
          <span className={cn(
            "text-[10px] md:text-xs tracking-wide",
            activePath === path.id ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {path.description}
          </span>
          
          {/* Active indicator */}
          {activePath === path.id && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-saffron rounded-full animate-pulse-glow" />
          )}
        </button>
      ))}
    </div>
  );
};

export default TrinityNav;
