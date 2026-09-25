import { useState, useCallback, useRef, useEffect } from 'react';
import { useRaffle } from '../context/RaffleContext';
import { maskDni } from '../utils/participants';
import RaffleAnimation from './RaffleAnimation';

export default function PrizeCard({ premio }) {
  const {
    state,
    PRIZE_STATUS,
    startDraw,
    setSelection,
    confirmWinner,
    markAbsent,
    getAvailableParticipants,
    updatePremioName,
  } = useRaffle();

  const prizeState = state.prizeStates[premio.id];
  const winner = state.winners[premio.id];
  const [drawWinner, setDrawWinner] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editValue, setEditValue] = useState(premio.nombre);
  const drawingLock = useRef(false);
  const inputRef = useRef(null);

  const status = prizeState?.status || PRIZE_STATUS.PENDING;
  const available = getAvailableParticipants();
  const hasAttempts = prizeState?.attempts?.length > 0;
  const canEditName = status !== PRIZE_STATUS.DRAWING && status !== PRIZE_STATUS.CONFIRMED;

  useEffect(() => {
    setEditValue(premio.nombre);
  }, [premio.nombre]);

  useEffect(() => {
    if (editingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingName]);

  const getStatusLabel = () => {
    switch (status) {
      case PRIZE_STATUS.PENDING:
        return hasAttempts ? 'Re-sorteo disponible' : 'Esperando sorteo';
      case PRIZE_STATUS.DRAWING:
        return 'Sorteando...';
      case PRIZE_STATUS.SELECTED:
        return 'Participante seleccionado';
      case PRIZE_STATUS.CONFIRMED:
        return 'Ganador confirmado';
      default:
        return 'Esperando sorteo';
    }
  };

  const handleSortear = useCallback(() => {
    if (drawingLock.current) return;
    if (status === PRIZE_STATUS.DRAWING || status === PRIZE_STATUS.CONFIRMED) return;
    if (status === PRIZE_STATUS.SELECTED) return;
    if (available.length === 0) return;

    drawingLock.current = true;
    const selected = startDraw(premio.id);
    if (!selected) {
      drawingLock.current = false;
      return;
    }

    setDrawWinner(selected);
    setIsAnimating(true);
  }, [status, available, startDraw, premio.id]);

  const handleAnimationComplete = useCallback(() => {
    if (drawWinner) {
      setSelection(premio.id, drawWinner);
    }
    setIsAnimating(false);
    drawingLock.current = false;
  }, [drawWinner, setSelection, premio.id]);

  const handleConfirm = () => {
    if (prizeState?.currentSelection) {
      confirmWinner(premio.id, prizeState.currentSelection);
      setDrawWinner(null);
    }
  };

  const handleVolverASortear = () => {
    if (prizeState?.currentSelection) {
      markAbsent(premio.id, prizeState.currentSelection);
      setDrawWinner(null);
    }
  };

  const saveName = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== premio.nombre) {
      updatePremioName(premio.id, trimmed);
    } else {
      setEditValue(premio.nombre);
    }
    setEditingName(false);
  };

  const startEditing = () => {
    if (!canEditName) return;
    setEditValue(premio.nombre);
    setEditingName(true);
  };

  const isBusy =
    status === PRIZE_STATUS.DRAWING ||
    status === PRIZE_STATUS.CONFIRMED ||
    status === PRIZE_STATUS.SELECTED ||
    isAnimating;

  const showAnimation = status === PRIZE_STATUS.DRAWING && isAnimating;
  const showPresence = status === PRIZE_STATUS.SELECTED && prizeState?.currentSelection;
  const showWinner = status === PRIZE_STATUS.CONFIRMED && winner;
  const showIdle = !showAnimation && !showPresence && !showWinner;

  const sortearLabel = hasAttempts
    ? 'Volver a sortear'
    : `Sortear ${premio.nombre}`;

  return (
    <div className={`prize-card prize-card--${status}`}>
      <div className="prize-card__header">
        <div className="prize-card__title-row">
          {editingName ? (
            <input
              ref={inputRef}
              className="prize-card__title-input"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => {
                if (e.key === 'Enter') saveName();
                if (e.key === 'Escape') {
                  setEditValue(premio.nombre);
                  setEditingName(false);
                }
              }}
            />
          ) : (
            <>
              <h3 className="prize-card__title">{premio.nombre}</h3>
              {canEditName && (
                <button
                  type="button"
                  className="prize-card__edit-dot"
                  onClick={startEditing}
                  title="Editar nombre del premio"
                  aria-label="Editar nombre del premio"
                />
              )}
            </>
          )}
        </div>
        <span className={`prize-card__status prize-card__status--${status}`}>
          {getStatusLabel()}
        </span>
      </div>

      <div className="prize-card__body">
        {showAnimation && (
          <RaffleAnimation
            participants={available}
            winner={drawWinner}
            isActive={isAnimating}
            onComplete={handleAnimationComplete}
          />
        )}

        {showPresence && (
          <div className="presence-validation">
            <button
              type="button"
              className="presence-validation__name presence-validation__name--confirm"
              onClick={handleConfirm}
            >
              {prizeState.currentSelection.nombre}
            </button>
            {prizeState.currentSelection.dni && (
              <div className="presence-validation__dni">
                DNI: {maskDni(prizeState.currentSelection.dni)}
              </div>
            )}
            <p className="presence-validation__hint">Clic en el nombre para confirmar ganador</p>
            <div className="presence-validation__actions">
              <button className="btn btn--secondary btn--large" onClick={handleVolverASortear}>
                Volver a sortear
              </button>
            </div>
          </div>
        )}

        {showWinner && (
          <div className="prize-card__winner">
            <div className="prize-card__winner-badge">✓ GANADOR</div>
            <div className="prize-card__winner-name">{winner.participant.nombre}</div>
          </div>
        )}

        {showIdle && (
          <div className="prize-card__idle">
            {available.length === 0 ? (
              <p className="prize-card__no-participants">
                No hay participantes disponibles
              </p>
            ) : (
              <button
                className={`btn ${hasAttempts ? 'btn--secondary' : 'btn--primary'} btn--large`}
                onClick={handleSortear}
                disabled={isBusy}
              >
                {sortearLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
