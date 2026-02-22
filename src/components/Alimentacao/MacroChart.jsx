import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const MacroChart = ({ totais, metas }) => {
  const { isDarkMode } = useTheme();

  const data = [
    {
      subject: 'Proteínas',
      atual: Math.round((totais.proteinas / metas.proteinas) * 100),
      meta: 100,
      fullMark: 150,
    },
    {
      subject: 'Carboidratos',
      atual: Math.round((totais.carboidratos / metas.carboidratos) * 100),
      meta: 100,
      fullMark: 150,
    },
    {
      subject: 'Gorduras',
      atual: Math.round((totais.gorduras / metas.gorduras) * 100),
      meta: 100,
      fullMark: 150,
    },
    {
      subject: 'Calorias',
      atual: Math.round((totais.calorias / metas.calorias) * 100),
      meta: 100,
      fullMark: 150,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`
          p-2 rounded-lg shadow-lg
          ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
          border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
        `}>
          <p className="font-semibold">{payload[0].payload.subject}</p>
          <p>Progresso: {payload[0].value}%</p>
          <p>Meta: 100%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid 
          stroke={isDarkMode ? '#4b5563' : '#e5e7eb'} 
        />
        <PolarAngleAxis 
          dataKey="subject" 
          tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563' }}
        />
        <PolarRadiusAxis 
          angle={30} 
          domain={[0, 150]}
          tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563' }}
        />
        
        <Radar
          name="Progresso"
          dataKey="atual"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.6}
        />
        
        <Radar
          name="Meta"
          dataKey="meta"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.3}
        />
        
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default MacroChart;