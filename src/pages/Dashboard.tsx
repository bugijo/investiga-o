import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import UserPanel from '@/components/dashboard/UserPanel';
import CaseCard from '@/components/dashboard/CaseCard';
import BottomNav from '@/components/dashboard/BottomNav';
import LoadingOverlay from '@/components/dashboard/LoadingOverlay';
import CRTOverlay from '@/components/CRTOverlay';

interface CaseData {
  caseNumber: string;
  status: 'ATIVO' | 'ARQUIVADO' | 'BLOQUEADO';
  classification?: string;
  location?: string;
  date?: string;
  secrecyLevel?: string;
  requiresCase?: string;
}

const cases: CaseData[] = [
  {
    caseNumber: '00',
    status: 'ATIVO',
    classification: 'MORTE SUSPEITA',
    location: 'ED. MIRAGE',
    date: '14/04/2026',
    secrecyLevel: 'MÉDIO',
  },
  {
    caseNumber: '01',
    status: 'BLOQUEADO',
    requiresCase: '00',
  },
  {
    caseNumber: '02',
    status: 'BLOQUEADO',
    requiresCase: '01',
  },
  {
    caseNumber: '03',
    status: 'BLOQUEADO',
    requiresCase: '02',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const handleCaseClick = useCallback((caseNumber: string) => {
    setSelectedCase(caseNumber);
    setIsLoading(true);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    if (selectedCase) {
      navigate(`/caso/${selectedCase}`);
    }
  }, [selectedCase, navigate]);

  const handleLogout = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background font-mono">
      <CRTOverlay />
      <LoadingOverlay isVisible={isLoading} onComplete={handleLoadingComplete} />

      <DashboardHeader />

      {/* Main Content */}
      <main className="pt-16 pb-20 px-4">
        {/* User Identification Panel */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <UserPanel />
        </motion.div>

        {/* Cases Section */}
        <motion.section
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-xs text-muted-foreground tracking-[0.3em] mb-4 border-b border-muted pb-2">
            INQUÉRITOS DISPONÍVEIS
          </h2>

          <div className="space-y-3">
            {cases.map((caseData, index) => (
              <motion.div
                key={caseData.caseNumber}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <CaseCard
                  {...caseData}
                  onClick={() => handleCaseClick(caseData.caseNumber)}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* System Info Footer */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <p className="text-[10px] text-muted-foreground/50 tracking-widest">
            SISTEMA INTEGRADO DE GESTÃO OPERACIONAL v4.2.1
          </p>
          <p className="text-[10px] text-muted-foreground/30 tracking-wider mt-1">
            ACESSO MONITORADO E REGISTRADO
          </p>
        </motion.div>
      </main>

      <BottomNav onLogout={handleLogout} />

      {/* Background subtle grid */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

export default Dashboard;
