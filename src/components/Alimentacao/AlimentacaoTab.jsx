import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  Apple,
  Coffee,
  Sun,
  Moon,
  PieChart,
  Camera,
  Edit3,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAlimentacao } from '../../context/AlimentacaoContext';
import { useTheme } from '../../context/ThemeContext';
import MetricCard from '../Shared/MetricCard';
import MacroChart from './MacroChart';
import RefeicaoCard from './RefeicaoCard';
import EditRefeicaoModal from './EditRefeicaoModal';

const AlimentacaoTab = () => {
  const { refeicoes, totais, metas, setMetas } = useAlimentacao();
  const { isDarkMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRefeicao, setSelectedRefeicao] = useState('cafeDaManha');

  const calcularProgresso = (atual, meta) => {
    return Math.min((atual / meta) * 100, 100);
  };

  const getIconeRefeicao = (key) => {
    const icones = {
      cafeDaManha: <Coffee className="w-5 h-5" />,
      almoco: <Sun className="w-5 h-5" />,
      lancheTarde: <Apple className="w-5 h-5" />,
      jantar: <Moon className="w-5 h-5" />
    };
    return icones[key] || <Utensils className="w-5 h-5" />;
  };

  const refeicoesOrdenadas = [
    { key: 'cafeDaManha', label: 'Café da Manhã', horario: '08:00' },
    { key: 'almoco', label: 'Almoço', horario: '12:30' },
    { key: 'lancheTarde', label: 'Lanche da Tarde', horario: '16:00' },
    { key: 'jantar', label: 'Jantar', horario: '20:00' }
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent"
        ><div className="flex gap-2">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => {
      const novasCalorias = prompt('Digite sua meta de calorias diárias:', metas.calorias);
      if (novasCalorias && !isNaN(novasCalorias)) {
        setMetas({ ...metas, calorias: Number(novasCalorias) });
      }
    }}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-lg
      ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
      transition-colors duration-300
    `}
  >
    <Target size={18} />
    <span>Editar Metas</span>
  </motion.button>
  
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => setIsEditModalOpen(true)}
    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
  >
    <Edit3 size={18} />
    <span>Editar Metas</span>
  </motion.button>
</div>
          🍽️ Alimentação
        </motion.h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Edit3 size={18} />
          <span>Editar Refeições</span>
        </motion.button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          titulo="Calorias"
          valor={`${totais.calorias}/${metas.calorias}`}
          icon={<PieChart />}
          trend={`${Math.round((totais.calorias / metas.calorias) * 100)}%`}
          cor={totais.calorias <= metas.calorias ? 'success' : 'warning'}
        />
        
        <MetricCard
          titulo="Proteínas"
          valor={`${totais.proteinas}/${metas.proteinas}g`}
          icon={<Utensils />}
          trend={`${Math.round((totais.proteinas / metas.proteinas) * 100)}%`}
          cor={totais.proteinas >= metas.proteinas ? 'success' : 'warning'}
        />
        
        <MetricCard
          titulo="Carboidratos"
          valor={`${totais.carboidratos}/${metas.carboidratos}g`}
          icon={<Apple />}
          trend={`${Math.round((totais.carboidratos / metas.carboidratos) * 100)}%`}
          cor="primary"
        />
        
        <MetricCard
          titulo="Gorduras"
          valor={`${totais.gorduras}/${metas.gorduras}g`}
          icon={<Target />}
          trend={`${Math.round((totais.gorduras / metas.gorduras) * 100)}%`}
          cor={totais.gorduras <= metas.gorduras ? 'success' : 'warning'}
        />
      </div>

      {/* Gráfico de Macros */}
      <div className={`
        rounded-xl p-4
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        shadow-lg
      `}>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Distribuição de Macros
        </h3>
        <MacroChart totais={totais} metas={metas} />
      </div>

      {/* Progress Bars */}
      <div className={`
        rounded-xl p-4
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        shadow-lg
      `}>
        <h3 className="text-xl font-semibold mb-4">Progresso do Dia</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>Calorias</span>
              <span>{totais.calorias} / {metas.calorias} kcal</span>
            </div>
            <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calcularProgresso(totais.calorias, metas.calorias)}%` }}
                className="h-full bg-success"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Proteínas</span>
              <span>{totais.proteinas} / {metas.proteinas}g</span>
            </div>
            <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calcularProgresso(totais.proteinas, metas.proteinas)}%` }}
                className="h-full bg-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Carboidratos</span>
              <span>{totais.carboidratos} / {metas.carboidratos}g</span>
            </div>
            <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calcularProgresso(totais.carboidratos, metas.carboidratos)}%` }}
                className="h-full bg-yellow-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Gorduras</span>
              <span>{totais.gorduras} / {metas.gorduras}g</span>
            </div>
            <div className="w-full h-3 bg-gray-300 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${calcularProgresso(totais.gorduras, metas.gorduras)}%` }}
                className="h-full bg-orange-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline de Refeições */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Timeline do Dia
        </h3>

        {refeicoesOrdenadas.map((ref, index) => (
          <RefeicaoCard
            key={ref.key}
            refeicaoKey={ref.key}
            label={ref.label}
            horario={ref.horario}
            icon={getIconeRefeicao(ref.key)}
            index={index}
            onEdit={() => {
              setSelectedRefeicao(ref.key);
              setIsEditModalOpen(true);
            }}
          />
        ))}
      </div>

      {/* Modal de Edição */}
      <EditRefeicaoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        refeicaoKey={selectedRefeicao}
      />
    </div>
  );
};

export default AlimentacaoTab;