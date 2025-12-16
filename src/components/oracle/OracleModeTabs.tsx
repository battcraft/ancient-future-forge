import React from 'react';
import { MessageSquare, Mic, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export type OracleMode = 'text' | 'voice' | 'vision';

interface OracleModeTabsProps {
  activeMode: OracleMode;
  onModeChange: (mode: OracleMode) => void;
}

const modes: { id: OracleMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'text', label: 'Text', icon: MessageSquare },
  { id: 'voice', label: 'Live Sage', icon: Mic },
  { id: 'vision', label: 'Vision', icon: Eye },
];

const OracleModeTabs: React.FC<OracleModeTabsProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-parchment/10 rounded-lg">
      {modes.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onModeChange(id)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
            activeMode === id
              ? 'bg-saffron text-primary-foreground'
              : 'text-parchment hover:bg-parchment/20'
          )}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default OracleModeTabs;
