import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush
} from 'recharts';
import { useTreino } from '../../context/TreinoContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const EvolutionChart = () => {
  const { treinos } = useTreino();
  const { isDarkMode } = useTheme();
  const [selectedExercise, setSelectedExercise] = useState('all');
  const [zoom, setZoom] = useState({ start: 0, end: 30 });

  // Processar dados para o gráfico
  const data = useMemo(() => {
    const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
    const semanas = 4; // Últimas 4 semanas
    const dados = [];

    for (let s = 0; s < semanas; s++) {
      dias.forEach((dia, dIndex) => {
        const treino = treinos[dia];
        if (treino?.exercicios) {
          const volumeDia = treino.exercicios.reduce((acc, ex) => {
            if (ex.realizado) {
              return acc + (ex.series * ex.reps * ex.carga);
            }
            return acc;
          }, 0);

          dados.push({
            name: `S${s+1} ${dia.substring(0,3)}`,
            volume: volumeDia,
            mediaCarga: treino.exercicios.reduce((acc, ex) => 
              ex.realizado ? acc + ex.carga : acc, 0) / treino.exercicios.length || 0,
            semana: s,
            dia: dIndex
          });
        }
      });
    }

    return dados;
  }, [treinos]);

  const exercises = useMemo(() => {
    const exs = new Set();
    Object.values(treinos).forEach(dia => {
      dia.exercicios?.forEach(ex => exs.add(ex.nome));
    });
    return ['all', ...Array.from(exs)];
  }, [treinos]);

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
              {entry.name}: {entry.value.toFixed(0)} {entry.name === 'volume' ? 'kg' : 'kg'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className={`
            px-3 py-1 rounded-lg text-sm
            ${isDarkMode 
              ? 'bg-gray-700 text-white border-gray-600' 
              : 'bg-white text-gray-900 border-gray-300'
            }
            border focus:outline-none focus:ring-2 focus:ring-primary-500
          `}
        >
          {exercises.map(ex => (
            <option key={ex} value={ex}>
              {ex === 'all' ? 'Todos os exercícios' : ex}
            </option>
          ))}
        </select>

        <button
          onClick={() => setZoom({ start: 0, end: 30 })}
          className={`
            px-3 py-1 rounded-lg text-sm
            ${isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors
          `}
        >
          Reset Zoom
        </button>
      </div>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
          />
          
          <XAxis 
            dataKey="name" 
            stroke={isDarkMode ? '#9ca3af' : '#4b5563'}
            tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563' }}
          />
          
          <YAxis 
            yAxisId="left"
            stroke={isDarkMode ? '#9ca3af' : '#4b5563'}
            tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563' }}
          />
          
          <YAxis 
            yAxisId="right" 
            orientation="right"
            stroke={isDarkMode ? '#9ca3af' : '#4b5563'}
            tick={{ fill: isDarkMode ? '#9ca3af' : '#4b5563' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="volume"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
            name="Volume (kg)"
          />
          
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="mediaCarga"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Média de Carga"
          />

          <Brush 
            dataKey="name" 
            height={30} 
            stroke="#3b82f6"
            fill={isDarkMode ? '#1f2937' : '#f3f4f6'}
            onChange={({ startIndex, endIndex }) => 
              setZoom({ start: startIndex, end: endIndex })
            }
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`
            p-3 rounded-lg text-center
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
          `}
        >
          <p className="text-sm opacity-70">Maior Volume</p>
          <p className="text-xl font-bold text-primary-500">
            {Math.max(...data.map(d => d.volume)).toFixed(0)} kg
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`
            p-3 rounded-lg text-center
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
          `}
        >
          <p className="text-sm opacity-70">Média de Volume</p>
          <p className="text-xl font-bold text-success">
            {(data.reduce((acc, d) => acc + d.volume, 0) / data.length).toFixed(0)} kg
          </p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`
            p-3 rounded-lg text-center
            ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
          `}
        >
          <p className="text-sm opacity-70">Tendência</p>
          <p className="text-xl font-bold text-warning">
            +{((data[data.length-1]?.volume - data[0]?.volume) / data[0]?.volume * 100).toFixed(0)}%
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default EvolutionChart;