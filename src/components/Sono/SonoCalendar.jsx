import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useSono } from '../../context/SonoContext';
import { useTheme } from '../../context/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SonoCalendar = () => {
  const { registros } = useSono();
  const { isDarkMode } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getQualidadeCor = (data) => {
    const dataStr = format(data, 'yyyy-MM-dd');
    const registro = registros[dataStr];
    
    if (!registro) return isDarkMode ? 'bg-gray-700' : 'bg-gray-200';
    
    if (registro.qualidade >= 8) return 'bg-green-500';
    if (registro.qualidade >= 6) return 'bg-yellow-500';
    if (registro.qualidade >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getQualidadeTexto = (data) => {
    const dataStr = format(data, 'yyyy-MM-dd');
    const registro = registros[dataStr];
    
    if (!registro) return 'Sem registro';
    
    const qualidades = {
      10: 'Excelente',
      9: 'Ótimo',
      8: 'Muito bom',
      7: 'Bom',
      6: 'Regular',
      5: 'Razoável',
      4: 'Ruim',
      3: 'Muito ruim',
      2: 'Péssimo',
      1: 'Horrível'
    };
    
    return qualidades[registro.qualidade] || 'Não informado';
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho do calendário */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className={`
              p-1 rounded-lg
              ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
              transition-colors
            `}
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={nextMonth}
            className={`
              p-1 rounded-lg
              ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
              transition-colors
            `}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
        {weekDays.map(day => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Dias do mês */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dataStr = format(day, 'yyyy-MM-dd');
          const registro = registros[dataStr];
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <motion.div
              key={dataStr}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              className={`
                relative aspect-square p-1 rounded-lg
                ${isCurrentMonth ? getQualidadeCor(day) : 'opacity-30'}
                ${isCurrentDay ? 'ring-2 ring-primary-500' : ''}
                cursor-pointer transition-all duration-200
                group
              `}
            >
              <div className="flex flex-col h-full">
                <span className={`
                  text-sm font-medium
                  ${isCurrentMonth ? 'text-white' : 'text-gray-500'}
                `}>
                  {format(day, 'd')}
                </span>
                
                {registro && (
                  <div className="mt-auto text-xs text-white/80">
                    {registro.duracao}h
                  </div>
                )}
              </div>

              {/* Tooltip */}
              <div className={`
                absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                px-2 py-1 text-xs rounded whitespace-nowrap
                ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
                shadow-lg opacity-0 group-hover:opacity-100 transition-opacity
                pointer-events-none z-20
              `}>
                {format(day, 'dd/MM')}: {getQualidadeTexto(day)}
                {registro && ` - ${registro.duracao}h`}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span>Ótimo (8-10)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded" />
          <span>Bom (6-7)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded" />
          <span>Regular (4-5)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span>Ruim (1-3)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          <span>Sem registro</span>
        </div>
      </div>

      {/* Estatísticas do mês */}
      <div className={`
        mt-4 p-3 rounded-lg
        ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
      `}>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm opacity-70">Média do mês</p>
            <p className="text-xl font-bold text-primary-500">
              {Object.values(registros)
                .filter(r => r.data.startsWith(format(currentDate, 'yyyy-MM')))
                .reduce((acc, r) => acc + r.duracao, 0) / 
                Object.values(registros).filter(r => r.data.startsWith(format(currentDate, 'yyyy-MM'))).length || 0
              }h
            </p>
          </div>
          
          <div>
            <p className="text-sm opacity-70">Qualidade média</p>
            <p className="text-xl font-bold text-success">
              {(Object.values(registros)
                .filter(r => r.data.startsWith(format(currentDate, 'yyyy-MM')))
                .reduce((acc, r) => acc + r.qualidade, 0) / 
                Object.values(registros).filter(r => r.data.startsWith(format(currentDate, 'yyyy-MM'))).length || 0
              ).toFixed(1)}
            </p>
          </div>
          
          <div>
            <p className="text-sm opacity-70">Dias registrados</p>
            <p className="text-xl font-bold text-warning">
              {Object.values(registros).filter(r => r.data.startsWith(format(currentDate, 'yyyy-MM'))).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SonoCalendar;