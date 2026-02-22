import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  Award,
  Edit3,
  ChevronDown,
  ChevronUp,
  Flame,
  Target,
  Trophy
} from 'lucide-react';
import { useTreino } from '../../context/TreinoContext';
import MetricCard from '../Shared/MetricCard';
import TreinoTable from './TreinoTable';
import EvolutionChart from './EvolutionChart';
import Heatmap from './HeatMap';
import EditTreinoModal from './EditTreinoModal';
import Conquistas from './Conquistas';
import { useTheme } from '../../context/ThemeContext';

const TreinoTab = () => {
  const { 
    treinos, 
    volumeTotal, 
    frequenciaSemanal, 
    conquistas,
    streak 
  } = useTreino();
  
  const { isDarkMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('segunda');
  const [showConquistas, setShowConquistas] = useState(false);

  // Calcular PRs (recorde pessoal)
  const calcularPRs = () => {
    let prs = 0;
    Object.values(treinos).forEach(dia => {
      dia.exercicios?.forEach(ex => {
        if (ex.carga > 80) prs++;
      });
    });
    return prs;
  };

  const handleEditDay = (dia) => {
    setSelectedDay(dia);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent"
        >
          🏋️ Treino
        </motion.h2>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowConquistas(!showConquistas)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
              transition-colors duration-300
            `}
          >
            <Trophy size={18} className="text-yellow-500" />
            <span>Conquistas ({conquistas.length})</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEditDay(selectedDay)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Edit3 size={18} />
            <span>Editar Treino</span>
          </motion.button>
        </div>
      </div>

      {/* Streak Banner */}
      {streak > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            p-4 rounded-lg border
            ${streak >= 5 ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-primary-500'}
            text-white
          `}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6" />
              <div>
                <p className="text-lg font-semibold">Sequência de {streak} dias! 🔥</p>
                <p className="text-sm opacity-90">
                  {streak >= 7 ? 'Você é imparável!' : 'Continue assim para bater seu recorde!'}
                </p>
              </div>
            </div>
            <div className="text-3xl">⚡</div>
          </div>
        </motion.div>
      )}

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          titulo="Volume Total"
          valor={`${(volumeTotal / 1000).toFixed(1)}k kg`}
          icon={<Dumbbell />}
          trend="+12%"
          cor="primary"
        />
        
        <MetricCard
          titulo="Frequência Semanal"
          valor={`${frequenciaSemanal}/7 dias`}
          icon={<Calendar />}
          trend={frequenciaSemanal >= 5 ? '+5%' : '-2%'}
          cor={frequenciaSemanal >= 5 ? 'success' : 'warning'}
        />
        
        <MetricCard
          titulo="Recordes Pessoais"
          valor={calcularPRs()}
          icon={<Target />}
          trend="+3"
          cor="success"
        />
      </div>

      {/* Conquistas Expandidas */}
      <AnimatePresence>
        {showConquistas && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Conquistas conquistas={conquistas} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabela de Treinos */}
      <div className={`
        rounded-xl p-4
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        shadow-lg
      `}>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Treinos da Semana
        </h3>
        <TreinoTable onEditDay={handleEditDay} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`
          rounded-xl p-4
          ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
          shadow-lg
        `}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Evolução de Cargas
          </h3>
          <EvolutionChart />
        </div>

        <div className={`
          rounded-xl p-4
          ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
          shadow-lg
        `}>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Consistência
          </h3>
          <Heatmap />
        </div>
      </div>

      {/* Modal de Edição */}
      <EditTreinoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        day={selectedDay}
        onDayChange={setSelectedDay}
      />
    </div>
  );
};

export default TreinoTab;