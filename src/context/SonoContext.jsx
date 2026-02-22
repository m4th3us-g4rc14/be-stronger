import React, { createContext, useState, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { addDays, format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SonoContext = createContext();

export const useSono = () => {
  const context = useContext(SonoContext);
  if (!context) {
    throw new Error('useSono must be used within a SonoProvider');
  }
  return context;
};

export const SonoProvider = ({ children }) => {
  // Gerar dados dos últimos 30 dias
  const gerarDadosIniciais = () => {
    const dados = {};
    const hoje = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const data = format(subDays(hoje, i), 'yyyy-MM-dd');
      const qualidade = Math.floor(Math.random() * 5) + 5; // 5-10
      
      dados[data] = {
        data,
        inicio: '22:30',
        fim: '06:30',
        duracao: 8,
        qualidade,
        profundo: Math.floor(Math.random() * 3) + 2, // 2-4 horas
        rem: Math.floor(Math.random() * 2) + 1.5, // 1.5-3 horas
        leve: 8 - (Math.floor(Math.random() * 3) + 2) - (Math.floor(Math.random() * 2) + 1.5),
        notas: '',
        interrupcoes: Math.floor(Math.random() * 3)
      };
    }
    
    return dados;
  };

  const [registros, setRegistros] = useLocalStorage('sono', gerarDadosIniciais());
  const [metaSono, setMetaSono] = useLocalStorage('metaSono', 8);
  const [lembretes, setLembretes] = useLocalStorage('lembretesSono', [
    { id: '1', horario: '22:00', ativo: true, dias: ['seg', 'ter', 'qua', 'qui', 'sex'] }
  ]);

  const adicionarRegistro = (data, registro) => {
    setRegistros(prev => ({
      ...prev,
      [data]: registro
    }));
  };

  const calcularMediaSemanal = () => {
    const ultimos7Dias = Object.values(registros).slice(-7);
    if (ultimos7Dias.length === 0) return 0;
    
    const soma = ultimos7Dias.reduce((acc, dia) => acc + dia.duracao, 0);
    return (soma / ultimos7Dias.length).toFixed(1);
  };

  const calcularConsistencia = () => {
    const registrosArray = Object.values(registros);
    if (registrosArray.length < 7) return 0;
    
    const ultimos7Dias = registrosArray.slice(-7);
    const desvios = ultimos7Dias.map(dia => Math.abs(dia.duracao - metaSono));
    const mediaDesvio = desvios.reduce((a, b) => a + b, 0) / desvios.length;
    
    return Math.max(0, 100 - (mediaDesvio * 10)).toFixed(0);
  };

  const toggleLembrete = (lembreteId) => {
    setLembretes(prev =>
      prev.map(l => l.id === lembreteId ? { ...l, ativo: !l.ativo } : l)
    );
  };

  const adicionarLembrete = (lembrete) => {
    setLembretes(prev => [...prev, { ...lembrete, id: Date.now() }]);
  };

  const removerLembrete = (lembreteId) => {
    setLembretes(prev => prev.filter(l => l.id !== lembreteId));
  };

  return (
    <SonoContext.Provider value={{
      registros,
      metaSono,
      lembretes,
      mediaSemanal: calcularMediaSemanal(),
      consistencia: calcularConsistencia(),
      adicionarRegistro,
      setMetaSono,
      toggleLembrete,
      adicionarLembrete,
      removerLembrete
    }}>
      {children}
    </SonoContext.Provider>
  );
};