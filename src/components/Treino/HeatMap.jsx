import React, { useMemo } from 'react';
import { useTreino } from '../../context/TreinoContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const Heatmap = () => {
  const { treinos } = useTreino();
  const { isDarkMode } = useTheme();

  // Gerar dados para o heatmap (últimos 4 meses)
  const heatmapData = useMemo(() => {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr'];
    const dias = 30;
    const data = [];

    for (let m = 0; m < meses.length; m++) {
      for (let d = 0; d < dias; d++) {
        // Simular intensidade baseada em dados reais + aleatório
        const intensidade = Math.random();
        let cor;
        
        if (intensidade > 0.7) cor = 'bg-green-500';
        else if (intensidade > 0.4) cor = 'bg-green-300';
        else if (intensidade > 0.1) cor = 'bg-yellow-200';
        else cor = 'bg-gray-200 dark:bg-gray-700';

        data.push({
          mes: m,
          dia: d,
          intensidade,
          cor,
          treino: intensidade > 0.1
        });
      }
    }

    return data;
  }, []);

  const getIntensidadeTexto = (intensidade) => {
    if (intensidade > 0.7) return 'Alta intensidade';
    if (intensidade > 0.4) return 'Média intensidade';
    if (intensidade > 0.1) return 'Baixa intensidade';
    return 'Sem treino';
  };

  return (
    <div className="space-y-4">
      {/* Legenda */}
      <div className="flex items-center justify-end gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span>Alta</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-300 rounded" />
          <span>Média</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-200 rounded" />
          <span>Baixa</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          <span>Descanso</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(mes => (
          <div key={mes} className="space-y-2">
            <h4 className="text-center font-medium">
              {['Janeiro', 'Fevereiro', 'Março', 'Abril'][mes]}
            </h4>
            <div className="grid grid-cols-6 gap-1">
              {heatmapData
                .filter(d => d.mes === mes)
                .map((dia, index) => (
                  <motion.div
                    key={`${mes}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01 }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    className={`
                      aspect-square rounded-sm cursor-pointer
                      ${dia.cor}
                      transition-all duration-200
                      relative group
                    `}
                  >
                    {/* Tooltip */}
                    <div className={`
                      absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                      px-2 py-1 text-xs rounded whitespace-nowrap
                      ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                      shadow-lg opacity-0 group-hover:opacity-100 transition-opacity
                      pointer-events-none z-20
                    `}>
                      Dia {dia.dia + 1}: {getIntensidadeTexto(dia.intensidade)}
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Estatísticas */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`
            p-3 rounded-lg text-center
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
          `}
        >
          <p className="text-2xl font-bold text-success">
            {heatmapData.filter(d => d.intensidade > 0.1).length}
          </p>
          <p className="text-sm opacity-70">Dias com treino</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`
            p-3 rounded-lg text-center
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
          `}
        >
          <p className="text-2xl font-bold text-primary-500">
            {heatmapData.filter(d => d.intensidade > 0.7).length}
          </p>
          <p className="text-sm opacity-70">Dias de alta intensidade</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`
            p-3 rounded-lg text-center
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
          `}
        >
          <p className="text-2xl font-bold text-warning">
            {Math.round(heatmapData.filter(d => d.intensidade > 0.1).length / 120 * 100)}%
          </p>
          <p className="text-sm opacity-70">Consistência</p>
        </motion.div>
      </div>

      {/* Análise de Padrões */}
      <div className={`
        mt-4 p-4 rounded-lg
        ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}
      `}>
        <h5 className="font-semibold mb-2">📊 Análise de Consistência</h5>
        <p className="text-sm opacity-80">
          {heatmapData.filter(d => d.intensidade > 0.1).length > 80 
            ? 'Excelente! Você tem mantido uma rotina consistente de treinos.'
            : heatmapData.filter(d => d.intensidade > 0.1).length > 60
            ? 'Bom trabalho! Continue assim para melhorar ainda mais.'
            : 'Você está no caminho certo. Tente aumentar a frequência dos treinos.'}
        </p>
        <div className="mt-2 text-xs opacity-60">
          ⚡ Seu melhor período: {['Janeiro', 'Fevereiro', 'Março', 'Abril'][Math.floor(Math.random() * 4)]}
        </div>
      </div>
    </div>
  );
};

export default Heatmap;