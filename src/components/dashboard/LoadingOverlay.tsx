import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const LoadingOverlay = ({ isVisible, onComplete }: LoadingOverlayProps) => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    if (!isVisible) {
      setLines([]);
      return;
    }

    const messages = [
      '> ABRINDO INQUÉRITO...',
      '> VERIFICANDO CREDENCIAIS...',
      '> CARREGANDO DOSSIÊ...',
      '> ACESSO AUTORIZADO',
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        const message = messages[index];
        setLines(prev => [...prev, message]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete?.();
        }, 300);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Screen flash effect */}
          <motion.div
            className="absolute inset-0 bg-primary/10"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          />

          <div className="font-mono text-sm space-y-2 p-8">
            {lines.map((line, i) => (
              <motion.p
                key={i}
                className={`${
                  line.includes('AUTORIZADO') ? 'text-primary text-glow' : 'text-muted-foreground'
                }`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {line}
                {i === lines.length - 1 && (
                  <span className="animate-blink">_</span>
                )}
              </motion.p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
