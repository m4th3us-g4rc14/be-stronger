export const templatesTreino = [
  {
    id: 'peito-tradicional',
    nome: 'Peito Tradicional',
    exercicios: [
      { nome: 'Supino reto', series: 4, reps: 10, carga: 0 },
      { nome: 'Supino inclinado', series: 4, reps: 10, carga: 0 },
      { nome: 'Crucifixo', series: 3, reps: 12, carga: 0 },
      { nome: 'Pullover', series: 3, reps: 12, carga: 0 }
    ]
  },
  {
    id: 'costas-completo',
    nome: 'Costas Completo',
    exercicios: [
      { nome: 'Puxada frontal', series: 4, reps: 10, carga: 0 },
      { nome: 'Remada baixa', series: 4, reps: 10, carga: 0 },
      { nome: 'Remada unilateral', series: 3, reps: 12, carga: 0 },
      { nome: 'Pull down', series: 3, reps: 12, carga: 0 }
    ]
  },
  {
    id: 'pernas-forca',
    nome: 'Pernas Força',
    exercicios: [
      { nome: 'Agachamento', series: 5, reps: 5, carga: 0 },
      { nome: 'Leg press', series: 4, reps: 8, carga: 0 },
      { nome: 'Extensora', series: 3, reps: 12, carga: 0 },
      { nome: 'Flexora', series: 3, reps: 12, carga: 0 },
      { nome: 'Panturrilha', series: 4, reps: 15, carga: 0 }
    ]
  },
  {
    id: 'ombros-definicao',
    nome: 'Ombro Definição',
    exercicios: [
      { nome: 'Desenvolvimento', series: 4, reps: 10, carga: 0 },
      { nome: 'Elevação lateral', series: 3, reps: 15, carga: 0 },
      { nome: 'Elevação frontal', series: 3, reps: 12, carga: 0 },
      { nome: 'Crucifixo inverso', series: 3, reps: 12, carga: 0 }
    ]
  },
  {
    id: 'bracos-maximo',
    nome: 'Braços Máximo',
    exercicios: [
      { nome: 'Rosca direta', series: 4, reps: 10, carga: 0 },
      { nome: 'Rosca martelo', series: 3, reps: 12, carga: 0 },
      { nome: 'Tríceps testa', series: 4, reps: 10, carga: 0 },
      { nome: 'Tríceps corda', series: 3, reps: 15, carga: 0 }
    ]
  },
  {
    id: 'cardio-emagrecimento',
    nome: 'Cardio Emagrecimento',
    exercicios: [
      { nome: 'Corrida', series: 1, reps: 1, carga: 30, unidade: 'min' },
      { nome: 'Bicicleta', series: 1, reps: 1, carga: 20, unidade: 'min' },
      { nome: 'Pular corda', series: 3, reps: 1, carga: 3, unidade: 'min' }
    ]
  }
];

export const templatesRefeicoes = {
  cafeDaManha: [
    { nome: 'Café da manhã proteico', alimentos: [
      { nome: 'Ovos mexidos', quantidade: 3 },
      { nome: 'Pão integral', quantidade: 2 },
      { nome: 'Café preto', quantidade: 200 }
    ]},
    { nome: 'Café da manhã leve', alimentos: [
      { nome: 'Iogurte grego', quantidade: 170 },
      { nome: 'Frutas', quantidade: 150 },
      { nome: 'Granola', quantidade: 30 }
    ]}
  ],
  almoco: [
    { nome: 'Almoço tradicional', alimentos: [
      { nome: 'Frango grelhado', quantidade: 150 },
      { nome: 'Arroz integral', quantidade: 100 },
      { nome: 'Feijão', quantidade: 80 },
      { nome: 'Salada', quantidade: 100 }
    ]},
    { nome: 'Almoço low carb', alimentos: [
      { nome: 'Salmão', quantidade: 150 },
      { nome: 'Brócolis', quantidade: 150 },
      { nome: 'Batata doce', quantidade: 100 }
    ]}
  ]
};