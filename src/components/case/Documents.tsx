import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: string;
}

interface DocumentsProps {
  documents: Document[];
}

const Documents = ({ documents }: DocumentsProps) => {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  return (
    <>
      <section className="border border-muted/30 bg-card/30 p-4">
        <h3 className="text-xs text-muted-foreground tracking-[0.3em] mb-3 border-b border-muted/30 pb-2">
          DOCUMENTOS
        </h3>
        <div className="space-y-2">
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="w-full text-left p-3 border border-muted/30 hover:border-primary/50 bg-card/20 font-mono text-xs transition-colors flex items-center gap-3"
            >
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-foreground">
                [ DOC {doc.id} ] — {doc.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <motion.div
            className="fixed inset-0 z-[200] bg-background flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-primary/30">
              <div className="font-mono text-xs">
                <span className="text-primary">DOC {selectedDoc.id}</span>
                <span className="text-muted-foreground ml-4">{selectedDoc.title}</span>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="font-mono text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed max-w-2xl mx-auto">
                {selectedDoc.content}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Documents;
