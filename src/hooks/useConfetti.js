import { useCallback } from 'react';

export function useConfetti() {
  const launchConfetti = useCallback(() => {
    // Criar elemento de confete
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
    document.body.appendChild(confettiContainer);

    // Criar confetes
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      const size = Math.random() * 10 + 5;
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 2 + 1;
      const delay = Math.random() * 2;
      const color = `hsl(${Math.random() * 360}, 80%, 60%)`;

      confetti.className = 'absolute animate-confetti';
      confetti.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        left: ${left}%;
        top: -20px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        transform: rotate(${Math.random() * 360}deg);
        animation: confetti ${animationDuration}s ease-in ${delay}s forwards;
      `;

      confettiContainer.appendChild(confetti);
    }

    // Remover container após animação
    setTimeout(() => {
      confettiContainer.remove();
    }, 5000);
  }, []);

  return { launchConfetti };
}