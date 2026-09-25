import { useState, useEffect, useCallback } from 'react';
import { RaffleProvider, useRaffle } from './context/RaffleContext';
import { hasExistingSession } from './utils/storage';
import TechBackground from './components/TechBackground';
import LoadScreen from './components/LoadScreen';
import MainScreen from './components/MainScreen';
import FinalScreen from './components/FinalScreen';
import SessionModal from './components/SessionModal';
import HistoryPanel from './components/HistoryPanel';
import AdminPanel from './components/AdminPanel';
import ParticipantsModal from './components/ParticipantsModal';

function AppContent() {
  const {
    state,
    allWinnersConfirmed,
    restoreSession,
    startNewSession,
    loadDemo,
  } = useRaffle();

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (hasExistingSession() && !state.loaded) {
      setShowSessionModal(true);
    } else {
      setInitialized(true);
    }
  }, []);

  const handleContinue = () => {
    restoreSession();
    setShowSessionModal(false);
    setInitialized(true);
  };

  const handleNew = () => {
    startNewSession();
    setShowSessionModal(false);
    setInitialized(true);
  };

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  if (!initialized && !showSessionModal) return null;

  if (showSessionModal) {
    return (
      <>
        <TechBackground />
        <SessionModal onContinue={handleContinue} onNew={handleNew} />
      </>
    );
  }

  if (allWinnersConfirmed && state.loaded) {
    return (
      <>
        <TechBackground />
        <FinalScreen premios={state.premios} winners={state.winners} />
        <button
          className="admin-fab"
          onClick={() => setShowAdmin(true)}
          title="Panel de control"
        >
          ⚙
        </button>
        {showAdmin && (
          <AdminPanel
            onClose={() => setShowAdmin(false)}
            onViewList={() => { setShowAdmin(false); setShowParticipants(true); }}
            onHistory={() => { setShowAdmin(false); setShowHistory(true); }}
            onLoadDemo={loadDemo}
          />
        )}
      </>
    );
  }

  return (
    <>
      <TechBackground />

      {!state.loaded ? (
        <LoadScreen />
      ) : (
        <MainScreen
          onViewList={() => setShowParticipants(true)}
          onHistory={() => setShowHistory(true)}
          onFullscreen={handleFullscreen}
        />
      )}

      <button
        className="admin-fab"
        onClick={() => setShowAdmin(true)}
        title="Panel de control"
      >
        ⚙
      </button>

      {showHistory && (
        <HistoryPanel
          history={state.history}
          premios={state.premios}
          onClose={() => setShowHistory(false)}
        />
      )}

      {showAdmin && (
        <AdminPanel
          onClose={() => setShowAdmin(false)}
          onViewList={() => { setShowAdmin(false); setShowParticipants(true); }}
          onHistory={() => { setShowAdmin(false); setShowHistory(true); }}
          onLoadDemo={loadDemo}
        />
      )}

      {showParticipants && (
        <ParticipantsModal
          participants={state.participants}
          onClose={() => setShowParticipants(false)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <RaffleProvider>
      <AppContent />
    </RaffleProvider>
  );
}
