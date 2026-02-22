import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      className={`
        relative p-2 rounded-lg overflow-hidden
        ${isDarkMode 
          ? 'bg-gray-800 text-yellow-400' 
          : 'bg-gray-100 text-gray-800'
        }
        transition-colors duration-300
      `}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDarkMode ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;