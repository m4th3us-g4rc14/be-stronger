import React from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Conquistas = ({ conquistas }) => {
  const { isDarkMode } = useTheme();

  const getIcone = (icone) => {
    switch(icone) {
      case '🏃': return <Zap className="w-8 h-8 text-yellow-500" />;
      case '✅': return <Award className="w-8 h-8 text-green-500" />;
      case '👑': return <Trophy className="w-8 h-8 text-yellow-500" />;
      default: return <Star className="w-8 h-8 text-primary-500" />;
    }
  };

  const todasConquistas = [
    {
      id: 'maratonista',
      nome: "Maratonista",
      descricao: "5 treinos na semana",
      icone: "🏃",
      desbloqueada: conquistas.some(c => c.id === 'maratonista')
    },
    {
      id: 'incansavel',
      nome: "Incansável",
      descricao: "Treinou todos os dias da semana",
      icone: "⚡",
      desbloqueada: conquistas.some(c => c.id === 'incansavel')
    },
    {
      id: 'consistente',
      nome: "Consistente",
      descricao: "7 dias seguidos de treino",
      icone: "🔥",
      desbloqueada: conquistas.some(c => c.id === 'consistente')
    },
    {
      id: 'forte',
      nome: "Forte como um Touro",
      descricao: "Atingiu 1000kg de volume total",
      icone: "💪",
      desbloqueada: conquistas.some(c => c.id === 'forte')
    },
    {
      id: 'evolucao',
      nome: "Evolução Constante",
      descricao: "Bateu recorde pessoal em 3 exercícios",
      icone: "📈",
      desbloqueada: conquistas.some(c => c.id === 'evolucao')
    },
    {
      id: 'dedicado',
      nome: "Dedicado",
      descricao: "Completou 30 treinos no mês",
      icone: "🎯",
      desbloqueada: conquistas.some(c => c.id === 'dedicado')
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" />
        Suas Conquistas
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {todasConquistas.map((conquista, index) => (
          <motion.div
            key={conquista.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              relative p-4 rounded-lg overflow-hidden
              ${conquista.desbloqueada 
                ? isDarkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-yellow-50 to-yellow-100' 
                : isDarkMode ? 'bg-gray-800 opacity-50' : 'bg-gray-100 opacity-50'
              }
              border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
              transition-all duration-300
              ${conquista.desbloqueada ? 'hover:scale-105 cursor-pointer' : ''}
            `}
          >
            {/* Efeito de brilho para conquistas desbloqueadas */}
            {conquista.desbloqueada && (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"
              />
            )}

            <div className="relative z-10">
              <div className="text-4xl mb-2">
                {conquista.icone}
              </div>
              
              <h4 className="font-semibold text-lg mb-1">
                {conquista.nome}
              </h4>
              
              <p className="text-sm opacity-70 mb-2">
                {conquista.descricao}
              </p>

              {conquista.desbloqueada ? (
                <div className="flex items-center gap-1 text-success text-sm">
                  <Award size={14} />
                  <span>Desbloqueada!</span>
                </div>
              ) : (
                <div className="text-xs opacity-50">
                  🔒 Ainda não desbloqueada
                </div>
              )}
            </div>

            {/* Selo de conquista */}
            {conquista.desbloqueada && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <Award size={14} className="text-white" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Barra de progresso geral */}
      <div className={`
        mt-6 p-4 rounded-lg
        ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
      `}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Progresso Total</span>
          <span className="text-primary-500 font-bold">
            {conquistas.length}/{todasConquistas.length} conquistas
          </span>
        </div>
        
        <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(conquistas.length / todasConquistas.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-primary-500 to-yellow-500"
          />
        </div>
      </div>

      {/* Próximas conquistas */}
      {conquistas.length < todasConquistas.length && (
        <div className={`
          mt-4 p-4 rounded-lg
          ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}
        `}>
          <h5 className="font-semibold mb-2 flex items-center gap-1">
            <Zap size={16} className="text-yellow-500" />
            Próximas Conquistas
          </h5>
          
          <div className="space-y-2">
            {todasConquistas
              .filter(c => !c.desbloqueada)
              .slice(0, 3)
              .map(conquista => (
                <div key={`next-${conquista.id}`} className="text-sm opacity-70">
                  • {conquista.nome}: {conquista.descricao}
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default Conquistas;