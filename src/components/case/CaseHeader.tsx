import { Lock } from 'lucide-react';

interface CaseHeaderProps {
  caseNumber: string;
}

const CaseHeader = ({ caseNumber }: CaseHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-primary/30">
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-xs text-muted-foreground tracking-wider">
          S.I.G.O. // DOSSIÊ DO INQUÉRITO
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-primary font-bold tracking-wider">
            CASO {caseNumber}
          </span>
          <Lock className="w-3 h-3 text-primary" />
        </div>
      </div>
    </header>
  );
};

export default CaseHeader;
