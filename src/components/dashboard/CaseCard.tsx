import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface CaseCardProps {
  caseNumber: string;
  status: 'ATIVO' | 'ARQUIVADO' | 'BLOQUEADO';
  classification?: string;
  location?: string;
  date?: string;
  secrecyLevel?: string;
  requiresCase?: string;
  onClick?: () => void;
}

const CaseCard = ({
  caseNumber,
  status,
  classification,
  location,
  date,
  secrecyLevel,
  requiresCase,
  onClick,
}: CaseCardProps) => {
  const isLocked = status === 'BLOQUEADO';

  return (
    <motion.button
      className={`w-full text-left border p-4 font-mono text-xs transition-all duration-300 ${
        isLocked
          ? 'border-muted/30 bg-card/20 opacity-50 cursor-not-allowed'
          : 'border-primary/40 bg-[#050505] hover:border-primary hover:shadow-[0_0_15px_rgba(0,255,65,0.15)] cursor-pointer'
      }`}
      onClick={isLocked ? undefined : onClick}
      whileTap={isLocked ? {} : { scale: 0.995 }}
      disabled={isLocked}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-primary tracking-widest">[ CASO {caseNumber} ]</span>
        {isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
      </div>

      {isLocked ? (
        <div className="space-y-1 text-muted-foreground">
          <p>ACESSO BLOQUEADO</p>
          <p className="text-destructive/70">REQUER: CONCLUSÃO DO CASO {requiresCase}</p>
        </div>
      ) : (
        <div className="space-y-1 text-muted-foreground">
          <p>STATUS: <span className={status === 'ATIVO' ? 'text-primary' : 'text-foreground'}>{status}</span></p>
          {classification && <p>CLASSIFICAÇÃO: <span className="text-foreground">{classification}</span></p>}
          {location && <p>LOCAL: <span className="text-foreground">{location}</span></p>}
          {date && <p>DATA: <span className="text-foreground">{date}</span></p>}
          {secrecyLevel && <p>NÍVEL DE SIGILO: <span className="text-foreground">{secrecyLevel}</span></p>}
        </div>
      )}
    </motion.button>
  );
};

export default CaseCard;
