import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useSono } from '../../context/SonoContext';
import { useTheme } from '../../context/ThemeContext';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SonoChart = () => {
  const { registros, metaSono } = useSono();
  const { isDarkMode } = useTheme();

  // Preparar dados para o gráfico (últimos 14 dias)
  const data = [];
  const hoje = new Date();

  for (let i = 13; i >= 0; i--) {
    const dataKey = format(subDays(hoje, i), 'yyyy-MM-dd');
    const registro = registros[dataKey];
    
    data.push({
      dia: format(subDays(hoje, i), 'dd/MM'),
      duracao: registro?.duracao || 0,
      qualidade: registro?.qualidade || 0,
      meta: metaSono,
      completo: registro ? true : false
    });
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`
          p-3 rounded-lg shadow-lg
          ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
          border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)} {entry.name === 'Duração' ? 'horas' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
          />
          
          <XAxis 
            dataKey="dia" 
            stroke={isDarkMode ? '#9ca3af' : '#4b5563'}
            tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563' }}
          />
          
          <YAxis 
            yAxisId="left"
            domain={[0, 12]}
            stroke={isDarkMode ? '#9ca3af' : '#4b5563'}
            tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563' }}
          />
          
          <YAxis 
            yAxisId="right" 
            orientation="right"
            domain={[0, 10]}
            stroke={isDarkMode ? '#9ca3af' : '#4b5563'}
            tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="duracao"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
            name="Duração (h)"
          />
          
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="qualidade"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Qualidade"
          />
          
          <ReferenceLine 
            y={metaSono} 
            yAxisId="left"
            label="Meta"
            stroke="#f59e0b" 
            strokeDasharray="3 3" 
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legenda de cores para dias sem registro */}
      <div className="flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full" />
          <span>Duração do sono</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span>Qualidade</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-warning border-dashed" />
          <span>Meta</span>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <p className="text-sm opacity-70">Média 14 dias</p>
          <p className="text-xl font-bold text-primary-500">
            {(data.reduce((acc, d) => acc + d.duracao, 0) / data.length).toFixed(1)}h
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm opacity-70">Melhor dia</p>
          <p className="text-xl font-bold text-success">
            {Math.max(...data.map(d => d.qualidade))}/10
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm opacity-70">Dias na meta</p>
          <p className="text-xl font-bold text-warning">
            {data.filter(d => d.duracao >= metaSono).length}/{data.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SonoChart;