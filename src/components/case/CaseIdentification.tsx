interface CaseIdentificationProps {
  caseNumber: string;
  classification: string;
  status: string;
  openDate: string;
}

const CaseIdentification = ({ caseNumber, classification, status, openDate }: CaseIdentificationProps) => {
  return (
    <section className="border border-muted/30 bg-card/30 p-4">
      <div className="space-y-2 text-xs font-mono">
        <div className="flex justify-between">
          <span className="text-muted-foreground">INQUÉRITO:</span>
          <span className="text-primary">CASO {caseNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">CLASSIFICAÇÃO:</span>
          <span className="text-foreground">{classification}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">STATUS:</span>
          <span className="text-primary">{status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">DATA DE ABERTURA:</span>
          <span className="text-foreground">{openDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">AUTORIDADE RESPONSÁVEL:</span>
          <span className="text-foreground">S.I.G.O.</span>
        </div>
      </div>
    </section>
  );
};

export default CaseIdentification;
