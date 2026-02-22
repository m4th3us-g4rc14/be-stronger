export const conquistasTreino = {
  maratonista: {
    id: 'maratonista',
    nome: 'Maratonista',
    descricao: '5 treinos na semana',
    icone: '🏃',
    criterio: 'frequencia >= 5'
  },
  incansavel: {
    id: 'incansavel',
    nome: 'Incansável',
    descricao: 'Treinou todos os dias da semana',
    icone: '⚡',
    criterio: 'frequencia >= 7'
  },
  consistente: {
    id: 'consistente',
    nome: 'Consistente',
    descricao: '7 dias seguidos de treino',
    icone: '🔥',
    criterio: 'streak >= 7'
  },
  forte: {
    id: 'forte',
    nome: 'Forte como um Touro',
    descricao: 'Atingiu 1000kg de volume total',
    icone: '💪',
    criterio: 'volume >= 1000'
  },
  evolucao: {
    id: 'evolucao',
    nome: 'Evolução Constante',
    descricao: 'Bateu recorde pessoal em 3 exercícios',
    icone: '📈',
    criterio: 'prs >= 3'
  },
  dedicado: {
    id: 'dedicado',
    nome: 'Dedicado',
    descricao: 'Completou 30 treinos no mês',
    icone: '🎯',
    criterio: 'treinosMes >= 30'
  }
};

export const conquistasAlimentacao = {
  dietaCheck: {
    id: 'dietaCheck',
    nome: 'Dieta Check',
    descricao: '100% das refeições registradas',
    icone: '✅',
    criterio: 'refeicoesCompletas'
  },
  equilibrado: {
    id: 'equilibrado',
    nome: 'Equilibrado',
    descricao: 'Manteve os macros balanceados por 7 dias',
    icone: '⚖️',
    criterio: 'macrosBalanceados'
  },
  hidratado: {
    id: 'hidratado',
    nome: 'Hidratado',
    descricao: 'Bebeu 2L de água por 5 dias',
    icone: '💧',
    criterio: 'aguaSuficiente'
  }
};

export const conquistasSono = {
  princesa: {
    id: 'princesa',
    nome: 'Sono de Princesa',
    descricao: '8h de sono por 7 dias',
    icone: '👑',
    criterio: 'sonoPerfeito'
  },
  regular: {
    id: 'regular',
    nome: 'Regular',
    descricao: 'Horário consistente por 2 semanas',
    icone: '⏰',
    criterio: 'horarioConsistente'
  },
  profundo: {
    id: 'profundo',
    nome: 'Sono Profundo',
    descricao: 'Alta qualidade de sono por 5 dias',
    icone: '😴',
    criterio: 'qualidadeAlta'
  }
};