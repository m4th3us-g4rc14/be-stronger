import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Moon,
  Sun,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Bell,
  Edit3,
  Activity,
  Heart
} from 'lucide-react';
import { useSono } from '../../context/SonoContext';
import { useTheme } from '../../context/ThemeContext';
import MetricCard from '../Shared/MetricCard';
import SonoCalendar from './SonoCalendar';
import SonoChart from './SonoChart';
import EditSonoModal from './EditSonoModal';
import Lembretes from './Lembretes';

const SonoTab = () => {
  const { mediaSemanal, consistencia, metaSono } = useSono();
  const { isDarkMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showLembretes, setShowLembretes] = useState(false);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
        >
          😴 Sono e Descanso
        </motion.h2>
        
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLembretes(!showLembretes)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}
              transition-colors duration-300
            `}
          >
            <Bell size={18} />
            <span>Lembretes</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Edit3 size={18} />
            <span>Editar Registro</span>
          </motion.button>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          titulo="Média Semanal"
          valor={`${mediaSemanal}h`}
          icon={<Moon />}
          trend={mediaSemanal >= metaSono ? '+0.5h' : '-0.5h'}
          cor={mediaSemanal >= metaSono ? 'success' : 'warning'}
        />
        
        <MetricCard
          titulo="Consistência"
          valor={`${consistencia}%`}
          icon={<TrendingUp />}
          trend={consistencia >= 80 ? '+5%' : '-3%'}
          cor={consistencia >= 80 ? 'success' : 'warning'}
        />
        
        <MetricCard
          titulo="Meta de Sono"
          valor={`${metaSono}h/dia`}
          icon={<Clock />}
          trend=""
          cor="primary"
        />
        
        <MetricCard
          titulo="Qualidade Média"
          valor="8.2/10"
          icon={<Heart />}
          trend="+0.3"
          cor="success"
        />
      </div>

      {/* Lembretes */}
      {showLembretes && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Lembretes />
        </motion.div>
      )}

      {/* Gráfico de Sono */}
      <div className={`
        rounded-xl p-4
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        shadow-lg
      `}>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Histórico de Sono
        </h3>
        <SonoChart />
      </div>

      {/* Calendário de Sono */}
      <div className={`
        rounded-xl p-4
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        shadow-lg
      `}>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Calendário de Qualidade
        </h3>
        <SonoCalendar />
      </div>

      {/* Fases do Sono */}
      <div className={`
        rounded-xl p-4
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        shadow-lg
      `}>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5" />
          Fases do Sono (Média)
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">😴</div>
            <div className="font-medium">Leve</div>
            <div className="text-2xl font-bold text-blue-500">3.2h</div>
            <div className="text-sm opacity-70">40%</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">💤</div>
            <div className="font-medium">Profundo</div>
            <div className="text-2xl font-bold text-green-500">2.8h</div>
            <div className="text-sm opacity-70">35%</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl mb-2">✨</div>
            <div className="font-medium">REM</div>
            <div className="text-2xl font-bold text-purple-500">2.0h</div>
            <div className="text-sm opacity-70">25%</div>
          </div>
        </div>

        <div className="mt-4 h-4 bg-gray-300 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div className="bg-blue-500" style={{ width: '40%' }} />
            <div className="bg-green-500" style={{ width: '35%' }} />
            <div className="bg-purple-500" style={{ width: '25%' }} />
          </div>
        </div>
      </div>

      {/* Análise de Tendências */}
      <div className={`
        p-4 rounded-lg
        ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-50'}
      `}>
        <h4 className="font-semibold mb-2">📊 Análise de Tendências</h4>
        <p className="text-sm opacity-80">
          {new Date().getDay() === 0 || new Date().getDay() === 6 
            ? 'Você tende a dormir mais tarde nos fins de semana. Tente manter uma rotina consistente!'
            : 'Durante a semana seu sono é mais regular. Continue assim!'}
        </p>
        <div className="mt-2 text-xs opacity-60">
          ⚡ Melhor horário para dormir: 22:30 - 23:00
        </div>
      </div>

      {/* Modal de Edição */}
      <EditSonoModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};

export default SonoTab;