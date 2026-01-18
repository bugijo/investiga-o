import { ArrowLeft, FolderOpen, Brain, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CaseBottomNavProps {
  onEvidencesClick?: () => void;
  onNotesClick?: () => void;
  canCloseCase?: boolean;
}

const CaseBottomNav = ({ onEvidencesClick, onNotesClick, canCloseCase = false }: CaseBottomNavProps) => {
  const navigate = useNavigate();

  const navItems = [
    {
      icon: ArrowLeft,
      label: 'VOLTAR',
      onClick: () => navigate('/central'),
      active: false,
      disabled: false,
    },
    {
      icon: FolderOpen,
      label: 'EVIDÊNCIAS',
      onClick: onEvidencesClick,
      active: false,
      disabled: false,
    },
    {
      icon: Brain,
      label: 'ANOTAÇÕES',
      onClick: onNotesClick,
      active: false,
      disabled: false,
    },
    {
      icon: AlertTriangle,
      label: 'ENCERRAR',
      onClick: () => {},
      active: false,
      disabled: !canCloseCase,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-primary/30">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            disabled={item.disabled}
            className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
              item.disabled
                ? 'opacity-30 cursor-not-allowed'
                : item.active
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CaseBottomNav;
