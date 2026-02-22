import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const MetricCard = ({ titulo, valor, icon, trend, cor = 'primary', onClick }) => {
  const { isDarkMode } = useTheme();

  const getCorClasses = () => {
    const cores = {
      primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
      success: 'bg-success/10 text-success',
      warning: 'bg-warning/10 text-warning',
      danger: 'bg-danger/10 text-danger'
    };
    return cores[cor] || cores.primary;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`
        cursor-pointer rounded-xl p-6 shadow-lg backdrop-blur-sm
        ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
        border border-gray-200 dark:border-gray-700
        hover:shadow-xl transition-shadow duration-300
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        {trend && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${trend.startsWith('+') ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}
            `}
          >
            {trend}
          </motion.span>
        )}
      </div>
      
      <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-1">
        {titulo}
      </h3>
      
      <p className={`text-3xl font-bold ${getCorClasses()}`}>
        {valor}
      </p>
    </motion.div>
  );
};

export default MetricCard;