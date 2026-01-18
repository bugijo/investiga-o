interface VictimProfileProps {
  name?: string;
  age: string;
  occupation: string;
  civilStatus: string;
  bodyLocation: string;
  isNameRevealed?: boolean;
}

const VictimProfile = ({ 
  name = '[CONFIDENCIAL]', 
  age, 
  occupation, 
  civilStatus, 
  bodyLocation,
  isNameRevealed = false 
}: VictimProfileProps) => {
  return (
    <section className="border border-muted/30 bg-card/30 p-4">
      <h3 className="text-xs text-muted-foreground tracking-[0.3em] mb-3 border-b border-muted/30 pb-2">
        VÍTIMA
      </h3>
      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between">
          <span className="text-muted-foreground">NOME:</span>
          <span className={isNameRevealed ? 'text-foreground' : 'text-destructive'}>
            {isNameRevealed ? name : '[CONFIDENCIAL]'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">IDADE:</span>
          <span className="text-foreground">{age}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">OCUPAÇÃO:</span>
          <span className="text-foreground">{occupation}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">ESTADO CIVIL:</span>
          <span className="text-foreground">{civilStatus}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">LOCALIZAÇÃO DO CORPO:</span>
          <span className="text-foreground">{bodyLocation}</span>
        </div>
      </div>
    </section>
  );
};

export default VictimProfile;
