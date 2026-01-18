import { useState, useEffect } from 'react';

interface InvestigatorNotesProps {
  caseNumber: string;
  onNotesChange?: (notes: string) => void;
}

const InvestigatorNotes = ({ caseNumber, onNotesChange }: InvestigatorNotesProps) => {
  const storageKey = `sigo_notes_case_${caseNumber}`;
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [storageKey]);

  const handleChange = (value: string) => {
    setNotes(value);
    localStorage.setItem(storageKey, value);
    onNotesChange?.(value);
  };

  return (
    <section className="border border-muted/30 bg-card/30 p-4">
      <h3 className="text-xs text-muted-foreground tracking-[0.3em] mb-3 border-b border-muted/30 pb-2">
        ANOTAÇÕES DO AGENTE
      </h3>
      <textarea
        value={notes}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Registrar hipóteses, observações ou contradições…"
        className="w-full h-32 bg-background/50 border border-muted/30 focus:border-primary/50 outline-none p-3 font-mono text-xs text-foreground placeholder:text-muted-foreground/50 resize-none transition-colors"
      />
      <p className="text-[10px] text-muted-foreground/50 mt-2 text-right">
        SALVO AUTOMATICAMENTE
      </p>
    </section>
  );
};

export default InvestigatorNotes;
