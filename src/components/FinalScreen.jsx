import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Logo from './Logo';

function TechParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const pts = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 3,
      duration: Math.random() * 4 + 3,
    }));
    setParticles(pts);
  }, []);

  return (
    <div className="tech-particles" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="tech-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.5, 0.5],
            y: [0, -30, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default function FinalScreen({ premios, winners, onGoHome }) {
  return (
    <div className="final-screen">
      <TechParticles />

      <motion.div
        className="final-screen__content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <Logo size="small" onClick={onGoHome} />

        <motion.h1
          className="final-screen__title"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          ¡TENEMOS <span className="highlight">GANADORES</span>!
        </motion.h1>

        <div className="final-screen__winners">
          {premios.map((premio, i) => {
            const winner = winners[premio.id];
            if (!winner) return null;
            return (
              <motion.div
                key={premio.id}
                className="final-winner-card"
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.3, duration: 0.6 }}
              >
                <h3 className="final-winner-card__premio">{premio.nombre}</h3>
                <div className="final-winner-card__name">
                  {winner.participant.nombre}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <div className="final-screen__glow" />
    </div>
  );
}
