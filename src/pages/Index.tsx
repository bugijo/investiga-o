import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import BiometricScanner from '@/components/BiometricScanner';
import CRTOverlay from '@/components/CRTOverlay';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const handleSuccess = () => {
    toast({
      title: "ACESSO AUTORIZADO",
      description: "Bem-vindo ao sistema S.I.G.O.",
      className: "bg-card border-primary text-primary",
    });
  };

  const handleDenied = () => {
    toast({
      title: "ACESSO NEGADO",
      description: "Autenticação incompleta. Tente novamente.",
      variant: "destructive",
    });
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col font-mono overflow-hidden">
      {/* CRT Effects */}
      <CRTOverlay />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-8">
        {/* Header */}
        <motion.header 
          className="w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top Bar */}
          <div className="flex justify-between items-center text-xs text-muted-foreground tracking-widest mb-4">
            <span className="animate-flicker">SYS.SECURE.V4</span>
            <span className="flex items-center gap-2">
              <Lock className="w-3 h-3" />
              CRIPTOGRAFADO
            </span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-muted mb-8" />

          {/* Title Section */}
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold tracking-[0.4em] text-primary text-glow mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              S.I.G.O.
            </motion.h1>
            
            <motion.p 
              className="text-xs md:text-sm tracking-[0.5em] text-primary/80 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              SISTEMA DE GESTÃO
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <span className="inline-block px-6 py-2 border border-primary text-primary text-xs tracking-[0.3em] uppercase">
                ACESSO RESTRITO
              </span>
            </motion.div>
          </div>
        </motion.header>

        {/* Main Scanner Area */}
        <main className="flex-1 flex items-center justify-center py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <BiometricScanner onSuccess={handleSuccess} onDenied={handleDenied} />
          </motion.div>
        </main>

        {/* Footer */}
        <motion.footer 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <p className="text-[10px] text-muted-foreground tracking-widest mb-2">
            IP: 192.168.0.X // ID: TERMINAL_884
          </p>
          <p className="text-[10px] text-destructive/70 tracking-wider">
            ACESSO NÃO AUTORIZADO É CRIME.
          </p>
        </motion.footer>
      </div>

      {/* Background Grid Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default Index;
