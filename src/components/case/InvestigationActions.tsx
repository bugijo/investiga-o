import { Clock, ChevronRight } from 'lucide-react';

interface InvestigationAction {
  id: string;
  label: string;
  description: string;
  timeCost: number;
  status: 'DISPONÍVEL' | 'CONCLUÍDA';
}

interface InvestigationActionsProps {
  status: string;
  elapsedHours: number;
  actions: InvestigationAction[];
  forensicsStatus: string;
  autopsyStatus: string;
  onAction: (id: string) => void;
  onAdvanceTime: () => void;
}

const InvestigationActions = ({
  status,
  elapsedHours,
  actions,
  forensicsStatus,
  autopsyStatus,
  onAction,
  onAdvanceTime,
}: InvestigationActionsProps) => {
  return (
    <section className="border border-muted/30 bg-card/30 p-4">
      <div className="flex items-start justify-between gap-4 border-b border-muted/30 pb-3">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.3em]">
            LOCAL DA OCORRÊNCIA
          </p>
          <p className="text-sm text-primary mt-1">STATUS: {status}</p>
        </div>
        <div className="text-right text-xs font-mono">
          <p className="text-muted-foreground">TEMPO DECORRIDO</p>
          <p className="text-primary text-sm">{elapsedHours}H</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onAction(action.id)}
            disabled={action.status === 'CONCLUÍDA'}
            className={`w-full text-left border p-3 text-xs font-mono transition-colors ${
              action.status === 'CONCLUÍDA'
                ? 'border-muted/20 text-muted-foreground/70 cursor-not-allowed'
                : 'border-muted/30 hover:border-primary/50 bg-card/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-primary">{action.label}</span>
              <span className="text-muted-foreground">
                {action.status} • +{action.timeCost}H
              </span>
            </div>
            <p className="mt-2 text-muted-foreground">{action.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2 border-t border-muted/30 pt-3 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">PERÍCIA</span>
          <span className="text-primary">{forensicsStatus}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">AUTÓPSIA</span>
          <span className="text-primary">{autopsyStatus}</span>
        </div>
      </div>

      <button
        onClick={onAdvanceTime}
        className="mt-4 w-full border border-primary/40 hover:border-primary transition-colors text-xs font-mono px-3 py-2 flex items-center justify-center gap-2"
      >
        <Clock className="w-4 h-4 text-primary" />
        Aguardar 1h
        <ChevronRight className="w-4 h-4 text-primary" />
      </button>
    </section>
  );
};

export default InvestigationActions;
