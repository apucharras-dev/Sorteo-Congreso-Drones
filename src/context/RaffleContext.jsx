import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { PREMIOS_DEFAULT } from '../config/premios';
import { saveState, loadState, clearState } from '../utils/storage';
import { pickRandomParticipant } from '../utils/random';
import { createParticipantsFromDemo } from '../utils/participants';
import { DEMO_PARTICIPANTS } from '../utils/demoData';
import { soundManager } from '../utils/sounds';

const RaffleContext = createContext(null);

const PRIZE_STATUS = {
  PENDING: 'pending',
  DRAWING: 'drawing',
  SELECTED: 'selected',
  CONFIRMED: 'confirmed',
};

function createInitialPrizeStates(premios) {
  const states = {};
  premios.forEach((p) => {
    states[p.id] = { status: PRIZE_STATUS.PENDING, currentSelection: null, attempts: [] };
  });
  return states;
}

const initialState = {
  participants: [],
  discarded: [],
  winners: {},
  prizeStates: createInitialPrizeStates(PREMIOS_DEFAULT),
  history: [],
  premios: PREMIOS_DEFAULT,
  demoMode: false,
  soundEnabled: true,
  loaded: false,
  duplicatesWarning: [],
  importWarnings: [],
};

function buildImportWarnings({ duplicates, missingDniColumn, withoutDni }) {
  const warnings = [];
  if (duplicates?.length > 0) {
    warnings.push(
      `Se omitieron ${duplicates.length} fila(s) duplicada(s) (mismo DNI o nombre).`
    );
  }
  if (missingDniColumn) {
    warnings.push(
      'No se detectó columna DNI. Agregá "DNI" o "Documento" para identificar a cada persona.'
    );
  } else if (withoutDni > 0) {
    warnings.push(`${withoutDni} participante(s) no tienen DNI en el archivo.`);
  }
  return warnings;
}

function raffleReducer(state, action) {
  switch (action.type) {
    case 'LOAD_PARTICIPANTS': {
      const { participants, duplicates, demoMode, missingDniColumn, withoutDni } =
        action.payload;
      return {
        ...initialState,
        participants,
        duplicatesWarning: duplicates || [],
        importWarnings: buildImportWarnings({
          duplicates,
          missingDniColumn,
          withoutDni,
        }),
        demoMode: demoMode || false,
        loaded: true,
        premios: state.premios,
        soundEnabled: state.soundEnabled,
        prizeStates: createInitialPrizeStates(state.premios),
      };
    }

    case 'RESTORE_STATE':
      return { ...action.payload, loaded: true };

    case 'START_DRAW': {
      const { prizeId } = action.payload;
      return {
        ...state,
        prizeStates: {
          ...state.prizeStates,
          [prizeId]: {
            ...state.prizeStates[prizeId],
            status: PRIZE_STATUS.DRAWING,
            currentSelection: null,
          },
        },
      };
    }

    case 'SET_SELECTION': {
      const { prizeId, participant } = action.payload;
      return {
        ...state,
        prizeStates: {
          ...state.prizeStates,
          [prizeId]: {
            ...state.prizeStates[prizeId],
            status: PRIZE_STATUS.SELECTED,
            currentSelection: participant,
          },
        },
      };
    }

    case 'CONFIRM_WINNER': {
      const { prizeId, participant } = action.payload;
      const now = Date.now();
      const attempt = {
        participant,
        status: 'confirmed',
        timestamp: now,
      };
      const prizeState = state.prizeStates[prizeId];
      const updatedAttempts = [...prizeState.attempts, attempt];

      return {
        ...state,
        winners: {
          ...state.winners,
          [prizeId]: { participant, confirmedAt: now },
        },
        prizeStates: {
          ...state.prizeStates,
          [prizeId]: {
            ...prizeState,
            status: PRIZE_STATUS.CONFIRMED,
            currentSelection: null,
            attempts: updatedAttempts,
          },
        },
        history: [
          ...state.history,
          {
            prizeId,
            premioNombre: state.premios.find((p) => p.id === prizeId)?.nombre,
            attempt: updatedAttempts.length,
            participant,
            status: 'confirmed',
            timestamp: now,
          },
        ],
      };
    }

    case 'MARK_ABSENT': {
      const { prizeId, participant } = action.payload;
      const now = Date.now();
      const attempt = {
        participant,
        status: 'absent',
        timestamp: now,
      };
      const prizeState = state.prizeStates[prizeId];
      const updatedAttempts = [...prizeState.attempts, attempt];

      return {
        ...state,
        discarded: [...state.discarded, participant.id],
        prizeStates: {
          ...state.prizeStates,
          [prizeId]: {
            ...prizeState,
            status: PRIZE_STATUS.PENDING,
            currentSelection: null,
            attempts: updatedAttempts,
          },
        },
        history: [
          ...state.history,
          {
            prizeId,
            premioNombre: state.premios.find((p) => p.id === prizeId)?.nombre,
            attempt: updatedAttempts.length,
            participant,
            status: 'absent',
            timestamp: now,
          },
        ],
      };
    }

    case 'UPDATE_PREMIOS':
      return {
        ...state,
        premios: action.payload,
      };

    case 'UPDATE_PREMIO_NAME': {
      const { prizeId, nombre } = action.payload;
      const trimmed = nombre.trim();
      if (!trimmed) return state;
      return {
        ...state,
        premios: state.premios.map((p) =>
          p.id === prizeId ? { ...p, nombre: trimmed } : p
        ),
      };
    }

    case 'TOGGLE_SOUND': {
      const enabled = !state.soundEnabled;
      soundManager.setEnabled(enabled);
      return { ...state, soundEnabled: enabled };
    }

    case 'RESET':
      clearState();
      return {
        ...initialState,
        premios: state.premios,
        soundEnabled: state.soundEnabled,
      };

    default:
      return state;
  }
}

export function RaffleProvider({ children }) {
  const [state, dispatch] = useReducer(raffleReducer, initialState);

  useEffect(() => {
    if (state.loaded) {
      saveState(state);
    }
  }, [state]);

  useEffect(() => {
    soundManager.setEnabled(state.soundEnabled);
  }, []);

  const getExcludedIds = useCallback(() => {
    const winnerIds = Object.values(state.winners).map((w) => w.participant.id);
    return [...new Set([...state.discarded, ...winnerIds])];
  }, [state.discarded, state.winners]);

  const getAvailableParticipants = useCallback(() => {
    const excluded = getExcludedIds();
    return state.participants.filter((p) => !excluded.includes(p.id));
  }, [state.participants, getExcludedIds]);

  const loadParticipants = useCallback(
    (participants, duplicates, demoMode = false, importMeta = {}) => {
      dispatch({
        type: 'LOAD_PARTICIPANTS',
        payload: { participants, duplicates, demoMode, ...importMeta },
      });
    },
    []
  );

  const loadDemo = useCallback(() => {
    const participants = createParticipantsFromDemo(DEMO_PARTICIPANTS);
    dispatch({
      type: 'LOAD_PARTICIPANTS',
      payload: { participants, duplicates: [], demoMode: true },
    });
  }, []);

  const restoreSession = useCallback(() => {
    const saved = loadState();
    if (saved) {
      dispatch({ type: 'RESTORE_STATE', payload: saved });
    }
  }, []);

  const startNewSession = useCallback(() => {
    clearState();
    dispatch({ type: 'RESET' });
  }, []);

  const startDraw = useCallback(
    (prizeId) => {
      const prizeState = state.prizeStates[prizeId];
      if (prizeState?.status === PRIZE_STATUS.CONFIRMED) return null;
      if (prizeState?.status === PRIZE_STATUS.DRAWING) return null;

      const available = getAvailableParticipants();
      if (available.length === 0) return null;

      const winner = pickRandomParticipant(available);
      dispatch({ type: 'START_DRAW', payload: { prizeId } });
      soundManager.play('start');
      return winner;
    },
    [state.prizeStates, getAvailableParticipants]
  );

  const setSelection = useCallback((prizeId, participant) => {
    dispatch({ type: 'SET_SELECTION', payload: { prizeId, participant } });
    soundManager.play('reveal');
  }, []);

  const confirmWinner = useCallback((prizeId, participant) => {
    dispatch({ type: 'CONFIRM_WINNER', payload: { prizeId, participant } });
    soundManager.play('confirm');
  }, []);

  const markAbsent = useCallback((prizeId, participant) => {
    dispatch({ type: 'MARK_ABSENT', payload: { prizeId, participant } });
  }, []);

  const updatePremios = useCallback((premios) => {
    dispatch({ type: 'UPDATE_PREMIOS', payload: premios });
  }, []);

  const updatePremioName = useCallback((prizeId, nombre) => {
    dispatch({ type: 'UPDATE_PREMIO_NAME', payload: { prizeId, nombre } });
  }, []);

  const resetRaffle = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  const allWinnersConfirmed = Object.keys(state.winners).length === state.premios.length;

  const stats = {
    total: state.participants.length,
    available: getAvailableParticipants().length,
    winners: Object.keys(state.winners).length,
    discarded: state.discarded.length,
  };

  const value = {
    state,
    stats,
    allWinnersConfirmed,
    PRIZE_STATUS,
    loadParticipants,
    loadDemo,
    restoreSession,
    startNewSession,
    startDraw,
    setSelection,
    confirmWinner,
    markAbsent,
    updatePremios,
    updatePremioName,
    resetRaffle,
    toggleSound,
    getAvailableParticipants,
    getExcludedIds,
  };

  return <RaffleContext.Provider value={value}>{children}</RaffleContext.Provider>;
}

export function useRaffle() {
  const ctx = useContext(RaffleContext);
  if (!ctx) throw new Error('useRaffle must be used within RaffleProvider');
  return ctx;
}
