import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { conquistasTreino } from '../data/conquistas';

const TreinoContext = createContext();

export const useTreino = () => {
  const context = useContext(TreinoContext);
  if (!context) {
    throw new Error('useTreino must be used within a TreinoProvider');
  }
  return context;
};

export const TreinoProvider = ({ children }) => {
  const [treinos, setTreinos] = useLocalStorage('treinos', {
    segunda: { tipo: "Peito", exercicios: [
      { id: '1', nome: "Supino", series: 4, reps: 10, carga: 60, realizado: false, ordem: 0 },
      { id: '2', nome: "Crucifixo", series: 3, reps: 12, carga: 20, realizado: false, ordem: 1 },
      { id: '3', nome: "Pullover", series: 3, reps: 12, carga: 30, realizado: false, ordem: 2 },
    ]},
    terca: { tipo: "Costas", exercicios: [
      { id: '4', nome: "Puxada frontal", series: 4, reps: 10, carga: 50, realizado: false, ordem: 0 },
      { id: '5', nome: "Remada baixa", series: 3, reps: 12, carga: 40, realizado: false, ordem: 1 },
    ]},
    quarta: { tipo: "Pernas", exercicios: [
      { id: '6', nome: "Agachamento", series: 4, reps: 8, carga: 80, realizado: false, ordem: 0 },
      { id: '7', nome: "Leg press", series: 4, reps: 10, carga: 150, realizado: false, ordem: 1 },
      { id: '8', nome: "Extensora", series: 3, reps: 12, carga: 40, realizado: false, ordem: 2 },
    ]},
    quinta: { tipo: "Ombro", exercicios: [
      { id: '9', nome: "Desenvolvimento", series: 4, reps: 10, carga: 30, realizado: false, ordem: 0 },
      { id: '10', nome: "Elevação lateral", series: 3, reps: 15, carga: 10, realizado: false, ordem: 1 },
    ]},
    sexta: { tipo: "Braços", exercicios: [
      { id: '11', nome: "Rosca direta", series: 3, reps: 12, carga: 20, realizado: false, ordem: 0 },
      { id: '12', nome: "Tríceps corda", series: 3, reps: 15, carga: 25, realizado: false, ordem: 1 },
    ]},
    sabado: { tipo: "Cardio", exercicios: [
      { id: '13', nome: "Corrida", series: 1, reps: 1, carga: 30, realizado: false, ordem: 0 },
    ]},
    domingo: { tipo: "Descanso", exercicios: [] },
  });

  const [conquistas, setConquistas] = useState([]);
  const [streak, setStreak] = useState(0);

  const calcularVolumeTotal = () => {
    let volume = 0;
    Object.values(treinos).forEach(dia => {
      dia.exercicios?.forEach(ex => {
        if (ex.realizado) {
          volume += ex.series * ex.reps * ex.carga;
        }
      });
    });
    return volume;
  };

  const calcularFrequenciaSemanal = () => {
    let count = 0;
    Object.values(treinos).forEach(dia => {
      if (dia.exercicios?.some(ex => ex.realizado)) {
        count++;
      }
    });
    return count;
  };

  const atualizarExercicio = (dia, exercicioId, novosDados) => {
    setTreinos(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        exercicios: prev[dia].exercicios.map(ex => 
          ex.id === exercicioId ? { ...ex, ...novosDados } : ex
        )
      }
    }));
  };

  const toggleRealizado = (dia, exercicioId) => {
    setTreinos(prev => {
      const novosTreinos = {
        ...prev,
        [dia]: {
          ...prev[dia],
          exercicios: prev[dia].exercicios.map(ex => 
            ex.id === exercicioId ? { ...ex, realizado: !ex.realizado } : ex
          )
        }
      };
      
      // Verificar conquistas após atualização
      verificarConquistas(novosTreinos);
      
      return novosTreinos;
    });
  };

  const verificarConquistas = (treinosAtuais) => {
    const novasConquistas = [];
    const frequencia = Object.values(treinosAtuais).filter(dia => 
      dia.exercicios?.some(ex => ex.realizado)
    ).length;

    // Verificar conquistas de frequência
    if (frequencia >= 5 && !conquistas.some(c => c.id === 'maratonista')) {
      novasConquistas.push(conquistasTreino.maratonista);
    }

    if (frequencia >= 7 && !conquistas.some(c => c.id === 'incansavel')) {
      novasConquistas.push(conquistasTreino.incansavel);
    }

    // Verificar streak
    const novoStreak = calcularStreak(treinosAtuais);
    setStreak(novoStreak);

    if (novoStreak >= 7 && !conquistas.some(c => c.id === 'consistente')) {
      novasConquistas.push(conquistasTreino.consistente);
    }

    if (novasConquistas.length > 0) {
      setConquistas(prev => [...prev, ...novasConquistas]);
      // Disparar confetes para novas conquistas
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('novaConquista', { detail: novasConquistas }));
      }, 100);
    }
  };

  const calcularStreak = (treinosAtuais) => {
    let streak = 0;
    const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    
    for (let i = 0; i < dias.length; i++) {
      const dia = dias[i];
      if (treinosAtuais[dia]?.exercicios?.some(ex => ex.realizado)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const reordenarExercicios = (dia, novosExercicios) => {
    setTreinos(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        exercicios: novosExercicios.map((ex, index) => ({ ...ex, ordem: index }))
      }
    }));
  };

  const duplicarExercicio = (dia, exercicio) => {
    const novoExercicio = {
      ...exercicio,
      id: `${Date.now()}-${Math.random()}`,
      realizado: false
    };
    
    setTreinos(prev => ({
      ...prev,
      [dia]: {
        ...prev[dia],
        exercicios: [...prev[dia].exercicios, novoExercicio]
      }
    }));
  };

  return (
    <TreinoContext.Provider value={{
      treinos,
      conquistas,
      streak,
      volumeTotal: calcularVolumeTotal(),
      frequenciaSemanal: calcularFrequenciaSemanal(),
      atualizarExercicio,
      toggleRealizado,
      reordenarExercicios,
      duplicarExercicio,
      setTreinos
    }}>
      {children}
    </TreinoContext.Provider>
  );
};