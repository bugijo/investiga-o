import { FolderOpen, Archive, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

type NavItem = 'casos' | 'arquivos' | 'sistema' | 'sair';

interface BottomNavProps {
  activeItem?: NavItem;
  onItemClick?: (item: NavItem) => void;
  onLogout?: () => void;
}

const BottomNav = ({ activeItem = 'casos', onItemClick, onLogout }: BottomNavProps) => {
  const items: { id: NavItem; icon: typeof FolderOpen; label: string; locked?: boolean }[] = [
    { id: 'casos', icon: FolderOpen, label: 'CASOS' },
    { id: 'arquivos', icon: Archive, label: 'ARQUIVOS', locked: true },
    { id: 'sistema', icon: Settings, label: 'SISTEMA' },
    { id: 'sair', icon: LogOut, label: 'ENCERRAR' },
  ];

  const handleClick = (item: NavItem, locked?: boolean) => {
    if (locked) return;
    if (item === 'sair') {
      onLogout?.();
    } else {
      onItemClick?.(item);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-muted">
      <div className="flex justify-around items-center py-3">
        {items.map(({ id, icon: Icon, label, locked }) => (
          <motion.button
            key={id}
            className={`flex flex-col items-center gap-1 px-4 py-1 transition-colors ${
              locked
                ? 'opacity-30 cursor-not-allowed'
                : activeItem === id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
            onClick={() => handleClick(id, locked)}
            whileTap={locked ? {} : { scale: 0.95 }}
            disabled={locked}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-wider">{label}</span>
            {activeItem === id && !locked && (
              <motion.div
                className="absolute -bottom-0 w-8 h-0.5 bg-primary"
                layoutId="activeTab"
              />
            )}
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
