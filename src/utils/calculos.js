// Cálculos para treino
export const calcularVolumeTotal = (treinos) => {
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

export const calcularFrequenciaSemanal = (treinos) => {
  let count = 0;
  Object.values(treinos).forEach(dia => {
    if (dia.exercicios?.some(ex => ex.realizado)) {
      count++;
    }
  });
  return count;
};

export const calcularPRs = (treinos) => {
  let prs = 0;
  Object.values(treinos).forEach(dia => {
    dia.exercicios?.forEach(ex => {
      if (ex.carga > 80) prs++;
    });
  });
  return prs;
};

// Cálculos para alimentação
export const calcularMacros = (alimentos) => {
  return alimentos.reduce((acc, alimento) => ({
    calorias: acc.calorias + (alimento.calorias * (alimento.quantidade / 100)),
    proteinas: acc.proteinas + (alimento.proteinas * (alimento.quantidade / 100)),
    carboidratos: acc.carboidratos + (alimento.carboidratos * (alimento.quantidade / 100)),
    gorduras: acc.gorduras + (alimento.gorduras * (alimento.quantidade / 100))
  }), { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
};

export const calcularProgressoMeta = (atual, meta) => {
  return Math.min((atual / meta) * 100, 100);
};

// Cálculos para sono
export const calcularMediaSono = (registros, dias = 7) => {
  const ultimosRegistros = Object.values(registros).slice(-dias);
  if (ultimosRegistros.length === 0) return 0;
  
  const soma = ultimosRegistros.reduce((acc, dia) => acc + dia.duracao, 0);
  return (soma / ultimosRegistros.length).toFixed(1);
};

export const calcularConsistenciaSono = (registros, meta) => {
  const registrosArray = Object.values(registros);
  if (registrosArray.length < 7) return 0;
  
  const ultimos7Dias = registrosArray.slice(-7);
  const desvios = ultimos7Dias.map(dia => Math.abs(dia.duracao - meta));
  const mediaDesvio = desvios.reduce((a, b) => a + b, 0) / desvios.length;
  
  return Math.max(0, 100 - (mediaDesvio * 10)).toFixed(0);
};