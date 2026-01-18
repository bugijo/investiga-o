import { useState, useEffect } from 'react';

interface UserPanelProps {
  agentName?: string;
}

const UserPanel = ({ agentName = "OPERADOR_7X" }: UserPanelProps) => {
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border border-muted bg-card/50 p-4 font-mono text-xs">
      <div className="space-y-1 text-muted-foreground">
        <p>AGENTE: <span className="text-foreground">{agentName}</span></p>
        <p>CARGO: <span className="text-foreground">Investigador Credenciado</span></p>
        <p>NÍVEL DE ACESSO: <span className="text-primary">ALFA-2</span></p>
        <p>SESSÃO ATIVA: <span className="text-primary">{formatTime(sessionTime)}</span></p>
      </div>
    </div>
  );
};

export default UserPanel;
