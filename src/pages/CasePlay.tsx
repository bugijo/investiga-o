import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CRTOverlay from '@/components/CRTOverlay';

type EvidenceType = 'image' | 'pdf' | 'chat' | 'audio' | 'note';

interface CaseEvidence {
  id: string;
  type: EvidenceType;
  title: string;
  file?: string;
  phase: number | 'event';
}

interface CaseAction {
  id: string;
  label: string;
  timeCost: number;
  unlocks?: string[];
  delayedUnlock?: {
    afterMinutes: number;
    unlocks: string[];
  };
}

interface Triad {
  id: string;
  requires: {
    fact: string;
    evidence: string;
    link: string;
  };
  onSuccess: {
    setPhase: number;
    unlockEvidence?: string[];
    unlockAccuse?: boolean;
  };
}

interface CaseData {
  id: string;
  title: string;
  baseTimeMinutes: number;
  initialState: {
    timeRemainingMinutes: number;
    noiseLevel: number;
    credibility: number;
    phase: number;
    unlockedEvidenceIds: string[];
  };
  actions: CaseAction[];
  evidence: CaseEvidence[];
  triads: Triad[];
  noiseEvent: {
    id: string;
    trigger: {
      timeRemainingBelowMinutes: number;
    };
    effect: {
      timeRemainingMultiplier: number;
      noiseAdd: number;
      unlockEvidence: string[];
    };
  };
  accusation: {
    correct: {
      suspect: string;
      motive: string;
      method: string;
      keyProof: string;
    };
  };
}

const caseData: CaseData = {
  id: 'case00_a_queda',
  title: 'A Queda',
  baseTimeMinutes: 1440,
  initialState: {
    timeRemainingMinutes: 1440,
    noiseLevel: 0,
    credibility: 100,
    phase: 1,
    unlockedEvidenceIds: ['img_001', 'doc_002', 'aud_003'],
  },
  actions: [
    { id: 'act_examine_scene', label: 'Examinar Cena', timeCost: 120, unlocks: ['note_scene_01'] },
    { id: 'act_talk_doorman', label: 'Falar com Porteiro', timeCost: 60, unlocks: ['note_doorman_01'] },
    { id: 'act_talk_neighbors', label: 'Falar com Vizinhos', timeCost: 60, unlocks: ['note_neighbor_01'] },
    { id: 'act_interrogate_marcos', label: 'Interrogar Marcos', timeCost: 120, unlocks: ['note_interrog_01'] },
    {
      id: 'act_call_forensics',
      label: 'Acionar Perícia',
      timeCost: 30,
      delayedUnlock: { afterMinutes: 360, unlocks: ['doc_005'] },
    },
  ],
  evidence: [
    { id: 'img_001', type: 'image', title: 'Foto da Cena', file: '/placeholder.svg', phase: 1 },
    { id: 'doc_002', type: 'pdf', title: 'B.O. Preliminar', file: '/placeholder.svg', phase: 1 },
    { id: 'aud_003', type: 'audio', title: 'Depoimento: Marcos', file: '/placeholder.svg', phase: 1 },
    { id: 'chat_004', type: 'chat', title: 'WhatsApp: Elena', file: '/placeholder.svg', phase: 2 },
    { id: 'doc_006', type: 'pdf', title: 'Extrato: Marcos', file: '/placeholder.svg', phase: 2 },
    { id: 'doc_005', type: 'pdf', title: 'Laudo Pericial', file: '/placeholder.svg', phase: 3 },
    { id: 'aud_007', type: 'audio', title: 'Interceptação: Advogado', file: '/placeholder.svg', phase: 'event' },
    { id: 'note_scene_01', type: 'note', title: 'Nota: Cena', phase: 1 },
    { id: 'note_doorman_01', type: 'note', title: 'Nota: Porteiro', phase: 1 },
    { id: 'note_neighbor_01', type: 'note', title: 'Nota: Vizinhos', phase: 1 },
    { id: 'note_interrog_01', type: 'note', title: 'Nota: Interrogatório', phase: 1 },
  ],
  triads: [
    {
      id: 'triad_01',
      requires: { fact: 'fact_not_suicide', evidence: 'chat_004', link: 'aud_003' },
      onSuccess: { setPhase: 2, unlockEvidence: ['chat_004', 'doc_006'] },
    },
    {
      id: 'triad_02',
      requires: { fact: 'fact_pushed', evidence: 'doc_005', link: 'img_001' },
      onSuccess: { setPhase: 3, unlockAccuse: true },
    },
  ],
  noiseEvent: {
    id: 'evt_advogado',
    trigger: { timeRemainingBelowMinutes: 480 },
    effect: { timeRemainingMultiplier: 0.3, noiseAdd: 35, unlockEvidence: ['aud_007'] },
  },
  accusation: {
    correct: {
      suspect: 'marcos',
      motive: 'financeiro',
      method: 'empurrao',
      keyProof: 'doc_005',
    },
  },
};

type TabKey = 'acoes' | 'dossie' | 'escuta' | 'lab' | 'timeline';

interface ScheduledUnlock {
  dueAtMinutes: number;
  unlocks: string[];
}

interface CaseProgress {
  timeRemainingMinutes: number;
  noiseLevel: number;
  credibility: number;
  phase: number;
  unlockedEvidenceIds: string[];
  triadsSolved: string[];
  timelineFacts: string[];
  eventTriggered: boolean;
  accuseUnlocked: boolean;
  completedActions: string[];
  scheduledUnlocks: ScheduledUnlock[];
}

const storageKey = `caseProgress:${caseData.id}`;

const defaultProgress: CaseProgress = {
  ...caseData.initialState,
  triadsSolved: [],
  timelineFacts: [],
  eventTriggered: false,
  accuseUnlocked: false,
  completedActions: [],
  scheduledUnlocks: [],
};

const CasePlay = () => {
  const { caseNumber } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('acoes');
  const [progress, setProgress] = useState<CaseProgress>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      return { ...defaultProgress, ...JSON.parse(saved) };
    }
    return defaultProgress;
  });
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [showNoiseEvent, setShowNoiseEvent] = useState(false);
  const [labFact, setLabFact] = useState('');
  const [labEvidence, setLabEvidence] = useState('');
  const [labLink, setLabLink] = useState('');
  const [labFeedback, setLabFeedback] = useState<string | null>(null);
  const [showAccusation, setShowAccusation] = useState(false);
  const [accusationForm, setAccusationForm] = useState({
    suspect: '',
    motive: '',
    method: '',
    keyProof: '',
  });
  const [accusationResult, setAccusationResult] = useState<string | null>(null);

  useEffect(() => {
    if (caseNumber !== '00') {
      navigate('/central');
    }
  }, [caseNumber, navigate]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress]);

  const elapsedMinutes = useMemo(
    () => caseData.baseTimeMinutes - progress.timeRemainingMinutes,
    [progress.timeRemainingMinutes],
  );

  const availableEvidence = useMemo(
    () =>
      caseData.evidence.filter((item) => progress.unlockedEvidenceIds.includes(item.id)),
    [progress.unlockedEvidenceIds],
  );

  const notes = availableEvidence.filter((item) => item.type === 'note');
  const dossieItems = availableEvidence.filter((item) => item.type !== 'audio' && item.type !== 'note');
  const audioItems = availableEvidence.filter((item) => item.type === 'audio');

  const handleAction = (actionId: string) => {
    const action = caseData.actions.find((entry) => entry.id === actionId);
    if (!action || progress.completedActions.includes(actionId)) return;

    const nextElapsed = elapsedMinutes + action.timeCost;
    const nextTimeRemaining = Math.max(0, caseData.baseTimeMinutes - nextElapsed);
    const newUnlocks = action.unlocks ?? [];
    const scheduledUnlocks = [...progress.scheduledUnlocks];

    if (action.delayedUnlock) {
      scheduledUnlocks.push({
        dueAtMinutes: nextElapsed + action.delayedUnlock.afterMinutes,
        unlocks: action.delayedUnlock.unlocks,
      });
    }

    setProgress((prev) => ({
      ...prev,
      timeRemainingMinutes: nextTimeRemaining,
      unlockedEvidenceIds: Array.from(new Set([...prev.unlockedEvidenceIds, ...newUnlocks])),
      completedActions: [...prev.completedActions, actionId],
      scheduledUnlocks,
    }));
  };

  useEffect(() => {
    if (progress.scheduledUnlocks.length === 0) return;
    const ready = progress.scheduledUnlocks.filter(
      (item) => item.dueAtMinutes <= elapsedMinutes,
    );
    if (ready.length === 0) return;

    const readyUnlocks = ready.flatMap((item) => item.unlocks);
    setProgress((prev) => ({
      ...prev,
      unlockedEvidenceIds: Array.from(new Set([...prev.unlockedEvidenceIds, ...readyUnlocks])),
      scheduledUnlocks: prev.scheduledUnlocks.filter(
        (item) => item.dueAtMinutes > elapsedMinutes,
      ),
    }));
  }, [elapsedMinutes, progress.scheduledUnlocks]);

  useEffect(() => {
    if (
      progress.eventTriggered ||
      progress.timeRemainingMinutes > caseData.noiseEvent.trigger.timeRemainingBelowMinutes
    ) {
      return;
    }

    const reducedTime = Math.floor(
      progress.timeRemainingMinutes * caseData.noiseEvent.effect.timeRemainingMultiplier,
    );

    setProgress((prev) => ({
      ...prev,
      timeRemainingMinutes: reducedTime,
      noiseLevel: Math.min(100, prev.noiseLevel + caseData.noiseEvent.effect.noiseAdd),
      unlockedEvidenceIds: Array.from(
        new Set([...prev.unlockedEvidenceIds, ...caseData.noiseEvent.effect.unlockEvidence]),
      ),
      eventTriggered: true,
    }));
    setShowNoiseEvent(true);
  }, [progress.eventTriggered, progress.timeRemainingMinutes]);

  const handleProcessTriad = () => {
    const match = caseData.triads.find(
      (triad) =>
        triad.requires.fact === labFact &&
        triad.requires.evidence === labEvidence &&
        triad.requires.link === labLink,
    );

    if (!match) {
      setLabFeedback('TRÍADE NEGADA — combinação inválida.');
      setProgress((prev) => ({
        ...prev,
        timeRemainingMinutes: Math.max(0, prev.timeRemainingMinutes - 30),
        noiseLevel: Math.min(100, prev.noiseLevel + 10),
      }));
      return;
    }

    if (progress.triadsSolved.includes(match.id)) {
      setLabFeedback('TRÍADE JÁ VALIDADA.');
      return;
    }

    setLabFeedback('TRÍADE CONFIRMADA. FATO ADICIONADO À TIMELINE.');
    setProgress((prev) => ({
      ...prev,
      phase: match.onSuccess.setPhase,
      triadsSolved: [...prev.triadsSolved, match.id],
      timelineFacts: [
        ...prev.timelineFacts,
        match.id === 'triad_01'
          ? 'FATO CONFIRMADO: A vítima não apresentava sinais de depressão.'
          : 'FATO CONFIRMADO: A vítima foi impulsionada por força externa.',
      ],
      unlockedEvidenceIds: Array.from(
        new Set([...prev.unlockedEvidenceIds, ...(match.onSuccess.unlockEvidence ?? [])]),
      ),
      accuseUnlocked: prev.accuseUnlocked || Boolean(match.onSuccess.unlockAccuse),
    }));
  };

  const selectedEvidence = availableEvidence.find((item) => item.id === selectedEvidenceId);

  const handleAccuse = () => {
    const { suspect, motive, method, keyProof } = accusationForm;
    const correct = caseData.accusation.correct;
    const isCorrect =
      suspect === correct.suspect &&
      motive === correct.motive &&
      method === correct.method &&
      keyProof === correct.keyProof;

    setAccusationResult(
      isCorrect
        ? 'MANDADO DE PRISÃO EMITIDO. HOMICÍDIO CONFIRMADO.'
        : 'ACUSAÇÃO INCONSISTENTE. REVISAR PROVAS.',
    );
  };

  return (
    <div className="min-h-screen bg-black text-[#bdbdbd] font-mono">
      <CRTOverlay />

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-500/30 bg-black/90 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3 text-xs tracking-widest">
          <span className="text-[#bdbdbd]">INQUÉRITO 00 — {caseData.title}</span>
          <button
            onClick={() => navigate(`/caso/${caseData.id === 'case00_a_queda' ? '00' : ''}`)}
            className="text-emerald-400 hover:text-emerald-200 transition-colors"
          >
            DOSSIÊ
          </button>
        </div>
        <div className="flex items-center justify-around border-t border-emerald-500/20 py-2 text-[10px]">
          <div className="text-center">
            <p className="text-emerald-400">TEMPO</p>
            <p>{progress.timeRemainingMinutes}m</p>
          </div>
          <div className="text-center">
            <p className="text-emerald-400">RUÍDO</p>
            <p>{progress.noiseLevel}</p>
          </div>
          <div className="text-center">
            <p className="text-emerald-400">CRED</p>
            <p>{progress.credibility}%</p>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-24 px-4 space-y-4">
        {activeTab === 'acoes' && (
          <section className="space-y-4">
            <div className="border border-emerald-500/30 p-4 bg-black/40">
              <p className="text-xs text-emerald-400 tracking-[0.3em]">AÇÕES DISPONÍVEIS</p>
              <p className="text-[11px] text-emerald-300/80 mt-2">
                Tempo decorrido: {elapsedMinutes} min • Fase {progress.phase}
              </p>
              <div className="mt-3 space-y-2">
                {caseData.actions.map((action) => {
                  const isDone = progress.completedActions.includes(action.id);
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleAction(action.id)}
                      disabled={isDone}
                      className={`w-full text-left border px-3 py-2 text-xs transition-colors ${
                        isDone
                          ? 'border-emerald-500/10 text-emerald-400/40 cursor-not-allowed'
                          : 'border-emerald-500/30 hover:border-emerald-400/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-300">{action.label}</span>
                        <span className="text-emerald-400/70">+{action.timeCost}m</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {notes.length > 0 && (
              <div className="border border-emerald-500/20 p-4 text-xs">
                <p className="text-emerald-400 tracking-[0.3em]">ANOTAÇÕES</p>
                <ul className="mt-3 space-y-2 text-emerald-200/80">
                  {notes.map((note) => (
                    <li key={note.id}>• {note.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {activeTab === 'dossie' && (
          <section className="border border-emerald-500/30 p-4 bg-black/40">
            <p className="text-xs text-emerald-400 tracking-[0.3em]">DOSSIÊ</p>
            {dossieItems.length === 0 ? (
              <p className="text-xs text-emerald-300/60 mt-4">Nenhuma evidência liberada.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {dossieItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedEvidenceId(item.id)}
                    className="w-full text-left border border-emerald-500/20 px-3 py-2 text-xs hover:border-emerald-400/60 transition-colors"
                  >
                    <span className="text-emerald-300">{item.title}</span>
                    <span className="ml-2 text-emerald-400/60">[{item.type.toUpperCase()}]</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'escuta' && (
          <section className="border border-emerald-500/30 p-4 bg-black/40">
            <p className="text-xs text-emerald-400 tracking-[0.3em]">ESCUTA</p>
            {audioItems.length === 0 ? (
              <p className="text-xs text-emerald-300/60 mt-4">Nenhum áudio liberado.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {audioItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedEvidenceId(item.id)}
                    className="w-full text-left border border-emerald-500/20 px-3 py-2 text-xs hover:border-emerald-400/60 transition-colors"
                  >
                    <span className="text-emerald-300">{item.title}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'lab' && (
          <section className="border border-emerald-500/30 p-4 bg-black/40 space-y-3 text-xs">
            <p className="text-emerald-400 tracking-[0.3em]">LABORATÓRIO</p>
            <div className="space-y-2">
              <label className="block">
                <span className="text-emerald-300">FATO</span>
                <select
                  value={labFact}
                  onChange={(event) => setLabFact(event.target.value)}
                  className="mt-1 w-full bg-black border border-emerald-500/20 px-2 py-1"
                >
                  <option value="">Selecionar</option>
                  <option value="fact_not_suicide">Vítima não estava suicida</option>
                  <option value="fact_pushed">Vítima foi empurrada</option>
                </select>
              </label>
              <label className="block">
                <span className="text-emerald-300">EVIDÊNCIA</span>
                <select
                  value={labEvidence}
                  onChange={(event) => setLabEvidence(event.target.value)}
                  className="mt-1 w-full bg-black border border-emerald-500/20 px-2 py-1"
                >
                  <option value="">Selecionar</option>
                  {availableEvidence.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-emerald-300">VÍNCULO</span>
                <select
                  value={labLink}
                  onChange={(event) => setLabLink(event.target.value)}
                  className="mt-1 w-full bg-black border border-emerald-500/20 px-2 py-1"
                >
                  <option value="">Selecionar</option>
                  {availableEvidence.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              onClick={handleProcessTriad}
              className="w-full border border-emerald-400/60 px-3 py-2 text-xs text-emerald-300 hover:border-emerald-300"
            >
              PROCESSAR TRÍADE
            </button>
            {labFeedback && <p className="text-emerald-200/80">{labFeedback}</p>}
          </section>
        )}

        {activeTab === 'timeline' && (
          <section className="border border-emerald-500/30 p-4 bg-black/40 text-xs space-y-3">
            <p className="text-emerald-400 tracking-[0.3em]">TIMELINE</p>
            {progress.timelineFacts.length === 0 ? (
              <p className="text-emerald-300/60">Nenhum fato confirmado.</p>
            ) : (
              <ul className="space-y-2 text-emerald-200/80">
                {progress.timelineFacts.map((fact) => (
                  <li key={fact}>• {fact}</li>
                ))}
              </ul>
            )}
            {progress.accuseUnlocked && (
              <button
                onClick={() => setShowAccusation(true)}
                className="w-full border border-emerald-400/60 px-3 py-2 text-xs text-emerald-300 hover:border-emerald-300"
              >
                EXPEDIR MANDADO
              </button>
            )}
          </section>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-500/30 bg-black/90">
        <div className="grid grid-cols-5 text-[10px]">
          {[
            { key: 'acoes', label: 'AÇÕES' },
            { key: 'dossie', label: 'DOSSIÊ' },
            { key: 'escuta', label: 'ESCUTA' },
            { key: 'lab', label: 'LAB' },
            { key: 'timeline', label: 'TIMELINE' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`py-2 ${
                activeTab === tab.key ? 'text-emerald-300' : 'text-emerald-400/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {selectedEvidence && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black/90 p-4 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between text-xs mb-4">
              <span className="text-emerald-400">{selectedEvidence.title}</span>
              <button
                onClick={() => setSelectedEvidenceId(null)}
                className="text-emerald-400 hover:text-emerald-200"
              >
                FECHAR
              </button>
            </div>
            {selectedEvidence.type === 'image' && (
              <div className="flex-1 flex items-center justify-center">
                <img
                  src={selectedEvidence.file}
                  alt={selectedEvidence.title}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
            {selectedEvidence.type === 'pdf' && (
              <div className="flex-1 border border-emerald-500/20 p-4 text-xs text-emerald-200/80">
                Visualização PDF indisponível no MVP. Substitua pelo arquivo real.
              </div>
            )}
            {selectedEvidence.type === 'chat' && (
              <div className="flex-1 border border-emerald-500/20 p-4 space-y-3 text-xs">
                <p className="text-emerald-300">[22:45] Amiga: Vai dar tempo?</p>
                <p className="text-emerald-200">[22:46] Elena: Comprei as passagens AGORA! ✈️</p>
                <p className="text-emerald-200">[22:46] Elena: Tô fazendo mala já.</p>
              </div>
            )}
            {selectedEvidence.type === 'audio' && (
              <div className="flex-1 border border-emerald-500/20 p-4 text-xs text-emerald-200/80">
                Player de áudio placeholder. Conecte o arquivo: {selectedEvidence.file}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNoiseEvent && (
          <motion.div
            className="fixed inset-0 z-[210] bg-red-950/90 p-4 flex flex-col justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="border border-red-500/40 p-4 text-xs space-y-3">
              <p className="text-red-200 tracking-[0.3em]">INTERCEPTAÇÃO</p>
              <p className="text-red-100">
                “Assina a cremação assim que liberarem. O forno apaga tudo.”
              </p>
              <button
                onClick={() => setShowNoiseEvent(false)}
                className="w-full border border-red-400/60 py-2 text-red-100"
              >
                OUVI E FECHAR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAccusation && (
          <motion.div
            className="fixed inset-0 z-[220] bg-black/95 p-4 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between text-xs mb-4">
              <span className="text-emerald-400">EXPEDIR MANDADO</span>
              <button
                onClick={() => setShowAccusation(false)}
                className="text-emerald-400 hover:text-emerald-200"
              >
                FECHAR
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <label className="block">
                Suspeito
                <select
                  value={accusationForm.suspect}
                  onChange={(event) =>
                    setAccusationForm((prev) => ({ ...prev, suspect: event.target.value }))
                  }
                  className="mt-1 w-full bg-black border border-emerald-500/20 px-2 py-1"
                >
                  <option value="">Selecionar</option>
                  <option value="marcos">Marcos</option>
                  <option value="carla">Carla</option>
                </select>
              </label>
              <label className="block">
                Motivo
                <select
                  value={accusationForm.motive}
                  onChange={(event) =>
                    setAccusationForm((prev) => ({ ...prev, motive: event.target.value }))
                  }
                  className="mt-1 w-full bg-black border border-emerald-500/20 px-2 py-1"
                >
                  <option value="">Selecionar</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="passional">Passional</option>
                  <option value="unknown">Desconhecido</option>
                </select>
              </label>
              <label className="block">
                Método
                <select
                  value={accusationForm.method}
                  onChange={(event) =>
                    setAccusationForm((prev) => ({ ...prev, method: event.target.value }))
                  }
                  className="mt-1 w-full bg-black border border-emerald-500/20 px-2 py-1"
                >
                  <option value="">Selecionar</option>
                  <option value="empurrao">Empurrão</option>
                  <option value="acidente">Acidente</option>
                  <option value="suicidio">Suicídio</option>
                </select>
              </label>
              <label className="block">
                Prova-chave
                <select
                  value={accusationForm.keyProof}
                  onChange={(event) =>
                    setAccusationForm((prev) => ({ ...prev, keyProof: event.target.value }))
                  }
                  className="mt-1 w-full bg-black border border-emerald-500/20 px-2 py-1"
                >
                  <option value="">Selecionar</option>
                  {availableEvidence.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={handleAccuse}
                className="w-full border border-emerald-400/60 px-3 py-2 text-xs text-emerald-300 hover:border-emerald-300"
              >
                VALIDAR ACUSAÇÃO
              </button>
              {accusationResult && <p className="text-emerald-200/80">{accusationResult}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CasePlay;
