import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Edit2 } from 'lucide-react';
import { useTreino } from '../../context/TreinoContext';
import { useTheme } from '../../context/ThemeContext';

const TreinoTable = ({ onEditDay }) => {
  const { treinos, toggleRealizado } = useTreino();
  const { isDarkMode } = useTheme();

  const diasSemana = [
    { key: 'segunda', label: 'Segunda' },
    { key: 'terca', label: 'Terça' },
    { key: 'quarta', label: 'Quarta' },
    { key: 'quinta', label: 'Quinta' },
    { key: 'sexta', label: 'Sexta' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' },
  ];

  const getTipoCor = (tipo) => {
    const cores = {
      'Peito': 'bg-blue-500',
      'Costas': 'bg-green-500',
      'Pernas': 'bg-purple-500',
      'Ombro': 'bg-yellow-500',
      'Braços': 'bg-red-500',
      'Cardio': 'bg-orange-500',
      'Descanso': 'bg-gray-500'
    };
    return cores[tipo] || 'bg-primary-500';
  };

  const calcularProgressoDia = (exercicios) => {
    if (!exercicios?.length) return 0;
    const realizados = exercicios.filter(ex => ex.realizado).length;
    return (realizados / exercicios.length) * 100;
  };

  return (
    <div className="space-y-3">
      {diasSemana.map((dia, index) => {
        const treino = treinos[dia.key];
        const progresso = calcularProgressoDia(treino?.exercicios);
        const temExercicios = treino?.exercicios?.length > 0;

        return (
          <motion.div
            key={dia.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              rounded-lg overflow-hidden border
              ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
              hover:shadow-md transition-shadow
            `}
          >
            {/* Cabeçalho do dia */}
            <div 
              className={`
                flex items-center justify-between p-3
                ${treino?.tipo ? getTipoCor(treino.tipo) + ' bg-opacity-10' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${treino?.tipo ? getTipoCor(treino.tipo) : 'bg-gray-500'}`} />
                <span className="font-semibold">{dia.label}</span>
                {treino?.tipo && (
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${getTipoCor(treino.tipo)} text-white
                  `}>
                    {treino.tipo}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {temExercicios && (
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-300 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progresso}%` }}
                        className="h-full bg-success"
                      />
                    </div>
                    <span className="text-sm">{progresso}%</span>
                  </div>
                )}
                
                <button
                  onClick={() => onEditDay(dia.key)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </div>

            {/* Exercícios do dia */}
            {temExercicios && (
              <div className="divide-y dark:divide-gray-700">
                {treino.exercicios.map((ex, idx) => (
                  <motion.div
                    key={ex.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                    className={`
                      flex items-center justify-between p-3
                      ${isDarkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'}
                      transition-colors cursor-pointer
                    `}
                    onClick={() => toggleRealizado(dia.key, ex.id)}
                  >
                    <div className="flex items-center gap-3">
                      {ex.realizado ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <span className={ex.realizado ? 'line-through opacity-60' : ''}>
                        {ex.nome}
                      </span>
                    </div>
                    
                    <div className="flex gap-4 text-sm">
                      <span>{ex.series}x</span>
                      <span>{ex.reps} reps</span>
                      <span className="font-mono">{ex.carga} kg</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default TreinoTable;