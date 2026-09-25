import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pickRandomParticipant } from '../utils/random';
import { maskDni } from '../utils/participants';
import { soundManager } from '../utils/sounds';

const ANIMATION_DURATION = 4000;
const TICK_INTERVAL_START = 60;
const TICK_INTERVAL_END = 400;

export default function RaffleAnimation({
  participants,
  winner,
  onComplete,
  isActive,
}) {
  const [displayName, setDisplayName] = useState('');
  const [phase, setPhase] = useState('idle');
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!isActive || !winner) return;

    setPhase('spinning');
    startTimeRef.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);

      if (progress < 1) {
        const random = pickRandomParticipant(participants);
        if (random) setDisplayName(random.nombre);
        soundManager.play('tick');

        const interval = TICK_INTERVAL_START + (TICK_INTERVAL_END - TICK_INTERVAL_START) * progress;
        intervalRef.current = setTimeout(tick, interval);
      } else {
        setDisplayName(winner.nombre);
        setPhase('revealed');
        onComplete();
      }
    };

    tick();

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [isActive, winner, participants, onComplete]);

  if (!isActive) return null;

  return (
    <div className="raffle-animation">
      <AnimatePresence mode="wait">
        {phase === 'spinning' && (
          <motion.div
            key="spinning"
            className="raffle-animation__spinning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="raffle-animation__label">SELECCIONANDO...</div>
            <motion.div
              className="raffle-animation__name spinning"
              key={displayName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.08 }}
            >
              {displayName}
            </motion.div>
            <div className="raffle-animation__scanner" />
          </motion.div>
        )}

        {phase === 'revealed' && (
          <motion.div
            key="revealed"
            className="raffle-animation__revealed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className="raffle-animation__winner-label">GANADOR</div>
            <motion.div
              className="raffle-animation__name winner"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
            >
              {winner.nombre}
            </motion.div>
            {winner.dni && (
              <div className="raffle-animation__dni">
                DNI: {maskDni(winner.dni)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
