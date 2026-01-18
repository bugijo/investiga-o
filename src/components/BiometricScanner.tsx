import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ScannerState = 'idle' | 'scanning' | 'success' | 'denied';

interface BiometricScannerProps {
  onSuccess?: () => void;
  onDenied?: () => void;
}

const BiometricScanner = ({ onSuccess, onDenied }: BiometricScannerProps) => {
  const [state, setState] = useState<ScannerState>('idle');
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handlePressStart = useCallback(() => {
    if (state === 'success') return;
    
    setState('scanning');
    progressRef.current = 0;
    setProgress(0);

    timerRef.current = setInterval(() => {
      progressRef.current += 2;
      setProgress(progressRef.current);

      if (progressRef.current >= 100) {
        clearTimer();
        setState('success');
        onSuccess?.();
      }
    }, 20);
  }, [state, clearTimer, onSuccess]);

  const handlePressEnd = useCallback(() => {
    if (state === 'success') return;

    clearTimer();

    if (progressRef.current < 100) {
      setState('denied');
      onDenied?.();
      
      setTimeout(() => {
        setState('idle');
        setProgress(0);
        progressRef.current = 0;
      }, 2000);
    }
  }, [state, clearTimer, onDenied]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const getStatusMessage = () => {
    switch (state) {
      case 'idle':
        return '[ SEGURE PARA AUTENTICAR ]';
      case 'scanning':
        return '[ ANALISANDO BIOMETRIA... ]';
      case 'success':
        return '[ ACESSO AUTORIZADO ]';
      case 'denied':
        return '[ ACESSO NEGADO ]';
      default:
        return '';
    }
  };

  const getBorderColor = () => {
    switch (state) {
      case 'idle':
        return 'border-muted';
      case 'scanning':
        return 'border-primary';
      case 'success':
        return 'border-primary';
      case 'denied':
        return 'border-destructive';
      default:
        return 'border-muted';
    }
  };

  const getIconColor = () => {
    switch (state) {
      case 'idle':
        return 'text-muted-foreground';
      case 'scanning':
        return 'text-primary';
      case 'success':
        return 'text-primary';
      case 'denied':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Scanner Container */}
      <div className="relative">
        {/* Progress Ring */}
        <svg
          className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)]"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="2"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={state === 'denied' ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={565.48}
            strokeDashoffset={565.48 - (565.48 * progress) / 100}
            transform="rotate(-90 100 100)"
            style={{
              filter: state === 'scanning' || state === 'success' 
                ? 'drop-shadow(0 0 8px hsl(var(--primary)))' 
                : 'none',
            }}
          />
        </svg>

        {/* Scanner Button */}
        <motion.button
          className={`relative w-44 h-44 rounded-full border-4 ${getBorderColor()} bg-card overflow-hidden cursor-pointer select-none transition-colors duration-300`}
          style={{
            boxShadow: state === 'scanning' || state === 'success'
              ? '0 0 30px hsl(var(--primary) / 0.4), inset 0 0 30px hsl(var(--primary) / 0.1)'
              : state === 'denied'
              ? '0 0 30px hsl(var(--destructive) / 0.4)'
              : 'none',
          }}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          whileTap={{ scale: 0.98 }}
        >
          {/* Scan Beam */}
          <AnimatePresence>
            {state === 'scanning' && (
              <motion.div
                className="absolute left-0 right-0 h-1 bg-primary animate-scan-beam"
                style={{
                  boxShadow: '0 0 20px 10px hsl(var(--primary) / 0.5)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </AnimatePresence>

          {/* Crosshair Lines */}
          <div className={`absolute inset-0 ${getIconColor()} transition-colors duration-300`}>
            {/* Horizontal Line */}
            <div 
              className="absolute top-1/2 left-4 right-4 h-px bg-current opacity-30"
              style={{ transform: 'translateY(-50%)' }}
            />
            {/* Vertical Line */}
            <div 
              className="absolute left-1/2 top-4 bottom-4 w-px bg-current opacity-30"
              style={{ transform: 'translateX(-50%)' }}
            />
          </div>

          {/* Fingerprint Icon */}
          <div className={`absolute inset-0 flex items-center justify-center ${getIconColor()} transition-colors duration-300`}>
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className={state === 'scanning' ? 'animate-pulse-glow' : ''}
              style={{
                filter: state === 'scanning' || state === 'success'
                  ? 'drop-shadow(0 0 10px currentColor)'
                  : 'none',
              }}
            >
              {/* Fingerprint arcs */}
              <path d="M50 85 C 25 85, 15 60, 15 45 C 15 25, 30 10, 50 10 C 70 10, 85 25, 85 45 C 85 55, 82 65, 75 75" />
              <path d="M50 75 C 30 75, 22 55, 22 45 C 22 30, 35 18, 50 18 C 65 18, 78 30, 78 45 C 78 52, 76 60, 70 68" />
              <path d="M50 65 C 35 65, 30 52, 30 45 C 30 35, 38 26, 50 26 C 62 26, 70 35, 70 45 C 70 50, 68 56, 64 62" />
              <path d="M50 55 C 42 55, 38 50, 38 45 C 38 40, 43 34, 50 34 C 57 34, 62 40, 62 45 C 62 48, 60 52, 57 55" />
              <path d="M50 45 C 50 42, 48 42, 50 42 C 52 42, 50 45, 50 48 L 50 70" />
            </svg>
          </div>

          {/* Success Overlay */}
          <AnimatePresence>
            {state === 'success' && (
              <motion.div
                className="absolute inset-0 bg-primary/20 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.svg
                  width="60"
                  height="60"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary)))' }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </motion.svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Status Message */}
      <motion.p
        className={`text-sm tracking-[0.3em] font-medium ${
          state === 'denied' ? 'text-destructive' : 
          state === 'success' ? 'text-primary text-glow' : 
          state === 'scanning' ? 'text-primary' : 'text-muted-foreground'
        } ${state === 'idle' ? 'animate-blink' : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={state}
      >
        {getStatusMessage()}
      </motion.p>
    </div>
  );
};

export default BiometricScanner;
