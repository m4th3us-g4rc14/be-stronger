import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Confetti = ({ active, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const novasParticulas = [];
      for (let i = 0; i < 50; i++) {
        novasParticulas.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 2,
          size: Math.random() * 10 + 5,
          color: `hsl(${Math.random() * 360}, 80%, 60%)`,
          rotation: Math.random() * 360
        });
      }
      setParticles(novasParticulas);

      // Auto desativar após animação
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 5000);
    }
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{ y: -20, x: `${particle.left}%`, rotate: 0, opacity: 1 }}
              animate={{ 
                y: '100vh', 
                rotate: particle.rotation * 2,
                opacity: 0
              }}
              transition={{ 
                duration: 3, 
                delay: particle.delay,
                ease: "easeOut"
              }}
              style={{
                position: 'absolute',
                width: particle.size,
                height: particle.size,
                background: particle.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                transform: `rotate(${particle.rotation}deg)`
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;