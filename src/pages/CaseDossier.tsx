import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CaseHeader from '@/components/case/CaseHeader';
import CaseIdentification from '@/components/case/CaseIdentification';
import VictimProfile from '@/components/case/VictimProfile';
import Timeline from '@/components/case/Timeline';
import EvidenceGallery from '@/components/case/EvidenceGallery';
import AudioRecords from '@/components/case/AudioRecords';
import Documents from '@/components/case/Documents';
import InvestigatorNotes from '@/components/case/InvestigatorNotes';
import CaseBottomNav from '@/components/case/CaseBottomNav';
import CRTOverlay from '@/components/CRTOverlay';

// Case 00 data
const caseData = {
  caseNumber: '00',
  classification: 'MORTE SUSPEITA',
  status: 'ATIVO',
  openDate: '14/04/2026',
  victim: {
    age: '34 ANOS',
    occupation: 'ARQUITETA',
    civilStatus: 'SOLTEIRA',
    bodyLocation: 'APARTAMENTO 1203',
  },
  timeline: [
    {
      date: '13/04/2026',
      time: '22:40',
      description: 'Último contato telefônico registrado.',
    },
    {
      date: '14/04/2026',
      time: '07:12',
      description: 'Porteiro relata ausência de movimentação.',
    },
    {
      date: '14/04/2026',
      time: '09:36',
      description: 'Corpo encontrado pela zeladoria.',
    },
    {
      date: '14/04/2026',
      time: '10:15',
      description: 'Perícia técnica acionada.',
    },
    {
      date: '14/04/2026',
      time: '14:30',
      description: 'Local isolado. Inquérito aberto.',
    },
  ],
  evidences: [
    { id: '01', thumbnail: '/placeholder.svg', location: 'ENTRADA', time: '09:38' },
    { id: '02', thumbnail: '/placeholder.svg', location: 'SALA', time: '09:41' },
    { id: '03', thumbnail: '/placeholder.svg', location: 'QUARTO', time: '09:45' },
    { id: '04', thumbnail: '/placeholder.svg', location: 'BANHEIRO', time: '09:52' },
  ],
  audioRecords: [
    { id: '01', origin: 'PORTEIRO', duration: '01:32', status: 'DISPONÍVEL' as const },
    { id: '02', origin: 'VIZINHO 1201', duration: '00:58', status: 'DISPONÍVEL' as const },
    { id: '03', origin: 'ZELADOR', duration: '02:14', status: 'CORROMPIDO' as const },
  ],
  documents: [
    {
      id: '01',
      title: 'LAUDO PRELIMINAR',
      content: `LAUDO TÉCNICO PRELIMINAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INQUÉRITO: CASO 00
DATA: 14/04/2026
PERITO RESPONSÁVEL: [REDACTED]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. CIRCUNSTÂNCIAS DO ÓBITO

A vítima foi encontrada no interior do 
apartamento 1203, em decúbito dorsal, 
próximo à janela da sala principal.

Não foram identificados sinais evidentes 
de arrombamento ou luta no local.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. OBSERVAÇÕES PRELIMINARES

- Porta trancada por dentro
- Janela entreaberta (15cm)
- Ausência de bilhete ou comunicação
- Objeto não identificado próximo ao corpo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. PENDÊNCIAS

Aguardando resultado toxicológico.
Análise de impressões digitais em curso.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASSIFICAÇÃO: SIGILOSO
DISTRIBUIÇÃO RESTRITA`,
    },
    {
      id: '02',
      title: 'REGISTRO DE OCORRÊNCIA',
      content: `BOLETIM DE OCORRÊNCIA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nº: 2026/04/0847
DATA: 14/04/2026
HORA: 09:42

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NATUREZA: MORTE A ESCLARECER

LOCAL: Edifício Mirage
        Rua das Acácias, 1450
        Apartamento 1203

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COMUNICANTE: José Almeida Silva
             Cargo: Zelador
             RG: [REDACTED]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RELATO:

"Por volta das 09h30, fui acionado 
pelo porteiro para verificar o 
apartamento 1203 devido à ausência 
de resposta da moradora. 

Ao abrir com a chave reserva, 
encontrei a moradora caída no chão 
da sala. Não toquei em nada e 
acionei imediatamente a polícia."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    },
    {
      id: '03',
      title: 'PLANTA DO APARTAMENTO',
      content: `PLANTA BAIXA - APARTAMENTO 1203
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ESCALA: 1:50
ÁREA TOTAL: 85m²

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

    ┌─────────────────────────┐
    │                         │
    │    QUARTO      BANH.    │
    │    (12m²)      (4m²)    │
    │                         │
    ├─────────┬───────────────┤
    │         │               │
    │  COZINHA│               │
    │  (8m²)  │    SALA       │
    │         │    (25m²)     │
    │─────────┤               │
    │ SERVIÇO │      [X]      │
    │  (3m²)  │    CORPO      │
    │         │               │
    └─────────┴───────────────┘
              │     ↑
            ENTRADA  JANELA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEGENDA:
[X] - Posição do corpo
↑   - Janela (entreaberta)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    },
  ],
};

const CaseDossier = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const evidencesRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (caseNumber !== '00') {
      navigate('/central');
    }
  }, [caseNumber, navigate]);

  const scrollToEvidences = () => {
    evidencesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToNotes = () => {
    notesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      <CRTOverlay />
      <CaseHeader caseNumber={caseData.caseNumber} />

      <main className="pt-16 pb-20 px-4">
        <motion.div
          className="space-y-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Case Identification */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CaseIdentification
              caseNumber={caseData.caseNumber}
              classification={caseData.classification}
              status={caseData.status}
              openDate={caseData.openDate}
            />
          </motion.div>

          {/* Victim Profile */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <VictimProfile {...caseData.victim} />
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Timeline events={caseData.timeline} />
          </motion.div>

          {/* Evidence Gallery */}
          <motion.div
            ref={evidencesRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <EvidenceGallery evidences={caseData.evidences} />
          </motion.div>

          {/* Audio Records */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AudioRecords records={caseData.audioRecords} />
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Documents documents={caseData.documents} />
          </motion.div>

          {/* Investigator Notes */}
          <motion.div
            ref={notesRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <InvestigatorNotes caseNumber={caseData.caseNumber} />
          </motion.div>

          {/* System Footer */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-[10px] text-muted-foreground/50 tracking-widest">
              ACESSO MONITORADO E REGISTRADO
            </p>
          </motion.div>
        </motion.div>
      </main>

      <CaseBottomNav
        onEvidencesClick={scrollToEvidences}
        onNotesClick={scrollToNotes}
        canCloseCase={false}
      />

      {/* Background grid */}
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

export default CaseDossier;
