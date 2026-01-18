import { Lock } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-primary/30">
      <div className="flex justify-between items-center px-4 py-3">
        <span className="text-xs text-muted-foreground tracking-widest">
          S.I.G.O. <span className="text-primary">//</span> CENTRAL DE INVESTIGAÇÕES
        </span>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-primary">STATUS: ONLINE</span>
          <Lock className="w-3 h-3 text-primary" />
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </header>
  );
};

export default DashboardHeader;
