import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface Evidence {
  id: string;
  thumbnail: string;
  location: string;
  time: string;
}

interface EvidenceGalleryProps {
  evidences: Evidence[];
}

const EvidenceGallery = ({ evidences }: EvidenceGalleryProps) => {
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  return (
    <>
      <section className="border border-muted/30 bg-card/30 p-4">
        <h3 className="text-xs text-muted-foreground tracking-[0.3em] mb-3 border-b border-muted/30 pb-2">
          EVIDÊNCIAS FOTOGRÁFICAS
        </h3>
        {evidences.length === 0 ? (
          <p className="text-[11px] text-muted-foreground/70 font-mono">
            Nenhuma evidência liberada nesta fase.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {evidences.map((evidence) => (
              <button
                key={evidence.id}
                onClick={() => setSelectedEvidence(evidence)}
                className="aspect-square bg-muted/20 border border-muted/30 hover:border-primary/50 transition-colors relative overflow-hidden group"
              >
                <img
                  src={evidence.thumbnail}
                  alt={`Evidência ${evidence.id}`}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity filter grayscale"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 px-2 py-1">
                  <span className="text-[10px] text-primary font-mono">
                    EVID. {evidence.id}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Fullscreen Viewer */}
      <AnimatePresence>
        {selectedEvidence && (
          <motion.div
            className="fixed inset-0 z-[200] bg-background flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-primary/30">
              <div className="font-mono text-xs">
                <span className="text-primary">EVIDÊNCIA {selectedEvidence.id}</span>
                <span className="text-muted-foreground ml-4">LOCAL: {selectedEvidence.location}</span>
                <span className="text-muted-foreground ml-4">HORÁRIO: {selectedEvidence.time}</span>
              </div>
              <button
                onClick={() => setSelectedEvidence(null)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <img
                src={selectedEvidence.thumbnail}
                alt={`Evidência ${selectedEvidence.id}`}
                className="max-w-full max-h-full object-contain filter grayscale"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EvidenceGallery;
