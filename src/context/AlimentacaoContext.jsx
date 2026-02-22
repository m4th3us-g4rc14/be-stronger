import React, { createContext, useState, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AlimentacaoContext = createContext();

export const useAlimentacao = () => {
  const context = useContext(AlimentacaoContext);
  if (!context) {
    throw new Error('useAlimentacao must be used within a AlimentacaoProvider');
  }
  return context;
};

export const AlimentacaoProvider = ({ children }) => {
  const [refeicoes, setRefeicoes] = useLocalStorage('refeicoes', {
    cafeDaManha: {
      horario: '08:00',
      alimentos: [
        { id: '1', nome: 'Pão integral', quantidade: 2, calorias: 150, proteinas: 6, carboidratos: 30, gorduras: 2 },
        { id: '2', nome: 'Ovos mexidos', quantidade: 2, calorias: 140, proteinas: 12, carboidratos: 1, gorduras: 10 },
      ],
      realizado: false,
      foto: null
    },
    almoco: {
      horario: '12:30',
      alimentos: [
        { id: '3', nome: 'Frango grelhado', quantidade: 150, calorias: 165, proteinas: 31, carboidratos: 0, gorduras: 3.6 },
        { id: '4', nome: 'Arroz integral', quantidade: 100, calorias: 124, proteinas: 2.6, carboidratos: 25.8, gorduras: 1 },
        { id: '5', nome: 'Brócolis', quantidade: 100, calorias: 34, proteinas: 2.8, carboidratos: 4.4, gorduras: 0.4 },
      ],
      realizado: false,
      foto: null
    },
    lancheTarde: {
      horario: '16:00',
      alimentos: [
        { id: '6', nome: 'Iogurte grego', quantidade: 170, calorias: 100, proteinas: 10, carboidratos: 3, gorduras: 5 },
        { id: '7', nome: 'Banana', quantidade: 1, calorias: 105, proteinas: 1.3, carboidratos: 27, gorduras: 0.3 },
      ],
      realizado: false,
      foto: null
    },
    jantar: {
      horario: '20:00',
      alimentos: [
        { id: '8', nome: 'Salmão', quantidade: 150, calorias: 208, proteinas: 30, carboidratos: 0, gorduras: 8 },
        { id: '9', nome: 'Batata doce', quantidade: 150, calorias: 130, proteinas: 2.3, carboidratos: 30, gorduras: 0.2 },
        { id: '10', nome: 'Salada', quantidade: 100, calorias: 20, proteinas: 1, carboidratos: 3, gorduras: 0.2 },
      ],
      realizado: false,
      foto: null
    }
  });

  const [metas, setMetas] = useLocalStorage('metasAlimentacao', {
    objetivo: 'ganharMassa', // emagrecer, ganharMassa, manter
    calorias: 2500,
    proteinas: 150,
    carboidratos: 300,
    gorduras: 70
  });

  const calcularTotais = () => {
    let totais = {
      calorias: 0,
      proteinas: 0,
      carboidratos: 0,
      gorduras: 0
    };

    Object.values(refeicoes).forEach(refeicao => {
      if (refeicao.realizado) {
        refeicao.alimentos?.forEach(alimento => {
          totais.calorias += alimento.calorias * (alimento.quantidade / (alimento.quantidade || 1));
          totais.proteinas += alimento.proteinas * (alimento.quantidade / (alimento.quantidade || 1));
          totais.carboidratos += alimento.carboidratos * (alimento.quantidade / (alimento.quantidade || 1));
          totais.gorduras += alimento.gorduras * (alimento.quantidade / (alimento.quantidade || 1));
        });
      }
    });

    return totais;
  };

  const toggleRefeicaoRealizada = (refeicaoKey) => {
    setRefeicoes(prev => ({
      ...prev,
      [refeicaoKey]: {
        ...prev[refeicaoKey],
        realizado: !prev[refeicaoKey].realizado
      }
    }));
  };

  const adicionarAlimento = (refeicaoKey, alimento) => {
    setRefeicoes(prev => ({
      ...prev,
      [refeicaoKey]: {
        ...prev[refeicaoKey],
        alimentos: [...prev[refeicaoKey].alimentos, { ...alimento, id: Date.now() }]
      }
    }));
  };

  const removerAlimento = (refeicaoKey, alimentoId) => {
    setRefeicoes(prev => ({
      ...prev,
      [refeicaoKey]: {
        ...prev[refeicaoKey],
        alimentos: prev[refeicaoKey].alimentos.filter(a => a.id !== alimentoId)
      }
    }));
  };

  const adicionarFoto = (refeicaoKey, foto) => {
    setRefeicoes(prev => ({
      ...prev,
      [refeicaoKey]: {
        ...prev[refeicaoKey],
        foto
      }
    }));
  };

  return (
    <AlimentacaoContext.Provider value={{
      refeicoes,
      metas,
      totais: calcularTotais(),
      toggleRefeicaoRealizada,
      adicionarAlimento,
      removerAlimento,
      adicionarFoto,
      setMetas
    }}>
      {children}
    </AlimentacaoContext.Provider>
  );
};