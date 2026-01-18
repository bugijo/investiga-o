import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause } from 'lucide-react';

interface AudioRecord {
  id: string;
  origin: string;
  duration: string;
  status: 'DISPONÍVEL' | 'CORROMPIDO' | 'BLOQUEADO';
}

interface AudioRecordsProps {
  records: AudioRecord[];
}

const AudioRecords = ({ records }: AudioRecordsProps) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AudioRecord | null>(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const handlePlay = (record: AudioRecord) => {
    if (record.status !== 'DISPONÍVEL') return;
    setCurrentRecord(record);
    setShowPlayer(true);
    setPlayingId(record.id);
    setProgress(0);
  };

  useEffect(() => {
    if (!playingId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setPlayingId(null);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playingId]);

  const handleClose = () => {
    setShowPlayer(false);
    setPlayingId(null);
    setProgress(0);
  };

  return (
    <>
      <section className="border border-muted/30 bg-card/30 p-4">
        <h3 className="text-xs text-muted-foreground tracking-[0.3em] mb-3 border-b border-muted/30 pb-2">
          REGISTROS DE ÁUDIO
        </h3>
        {records.length === 0 ? (
          <p className="text-[11px] text-muted-foreground/70 font-mono">
            Nenhum áudio liberado nesta fase.
          </p>
        ) : (
          <div className="space-y-2">
            {records.map((record) => (
              <button
                key={record.id}
                onClick={() => handlePlay(record)}
                disabled={record.status !== 'DISPONÍVEL'}
                className={`w-full text-left p-3 border font-mono text-xs transition-colors ${
                  record.status === 'DISPONÍVEL'
                    ? 'border-muted/30 hover:border-primary/50 bg-card/20'
                    : 'border-muted/20 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-primary">[ ÁUDIO {record.id} ]</span>
                  <span className={`${
                    record.status === 'DISPONÍVEL' ? 'text-primary' : 'text-destructive'
                  }`}>
                    {record.status}
                  </span>
                </div>
                <div className="mt-2 text-muted-foreground">
                  <span>ORIGEM: {record.origin}</span>
                  <span className="ml-4">DURAÇÃO: {record.duration}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Audio Player Modal */}
      <AnimatePresence>
        {showPlayer && currentRecord && (
          <motion.div
            className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="font-mono text-center space-y-6 p-8">
              <p className="text-xs text-muted-foreground tracking-wider">
                ÁUDIO {currentRecord.id} // {currentRecord.origin}
              </p>
              
              <p className="text-sm text-primary animate-pulse">
                {playingId ? 'REPRODUZINDO REGISTRO…' : 'REPRODUÇÃO CONCLUÍDA'}
              </p>

              <div className="w-64 h-1 bg-muted/30 mx-auto">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>

              <button
                onClick={() => playingId ? setPlayingId(null) : handlePlay(currentRecord)}
                className="p-4 border border-primary/50 hover:border-primary transition-colors"
              >
                {playingId ? (
                  <Pause className="w-6 h-6 text-primary" />
                ) : (
                  <Play className="w-6 h-6 text-primary" />
                )}
              </button>

              <p className="text-[10px] text-muted-foreground/50">
                DURAÇÃO: {currentRecord.duration}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AudioRecords;
