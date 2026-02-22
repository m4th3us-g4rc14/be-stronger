import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Dumbbell, 
  Utensils, 
  Moon, 
  Menu, 
  X,
  Download,
  Upload,
  Zap,
  Trophy,
  Bell
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTreino } from '../../context/TreinoContext';
import { useAlimentacao } from '../../context/AlimentacaoContext';
import { useSono } from '../../context/SonoContext';
import ThemeToggle from '../Shared/ThemeToggle';
import Confetti from '../Shared/Confetti';
import TreinoTab from '../Treino/TreinoTab';
import AlimentacaoTab from '../Alimentacao/AlimentacaoTab';
import SonoTab from '../Sono/SonoTab';
import Tutorial from './Tutorial';
import ExportModal from './ExportModal';

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const { conquistas: treinoConquistas } = useTreino();
  const { totais } = useAlimentacao();
  const { mediaSemanal } = useSono();
  
  const [activeTab, setActiveTab] = useState('treino');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Verificar se é primeiro acesso
  useEffect(() => {
    const primeiroAcesso = !localStorage.getItem('tutorialVisto');
    if (primeiroAcesso) {
      setShowTutorial(true);
    }
  }, []);

  // Escutar eventos de conquistas
  useEffect(() => {
    const handleNovaConquista = (event) => {
      setShowConfetti(true);
      toast.success('Nova conquista desbloqueada! 🏆', {
        duration: 5000,
        icon: '🎉'
      });
    };

    window.addEventListener('novaConquista', handleNovaConquista);
    return () => window.removeEventListener('novaConquista', handleNovaConquista);
  }, []);

  const tabs = [
    { id: 'treino', label: 'Treino', icon: Dumbbell, color: 'primary' },
    { id: 'alimentacao', label: 'Alimentação', icon: Utensils, color: 'green' },
    { id: 'sono', label: 'Sono', icon: Moon, color: 'indigo' }
  ];

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          localStorage.setItem('treinos', JSON.stringify(data.treinos));
          localStorage.setItem('refeicoes', JSON.stringify(data.refeicoes));
          localStorage.setItem('sono', JSON.stringify(data.sono));
          toast.success('Dados importados com sucesso!');
          window.location.reload();
        } catch (error) {
          toast.error('Erro ao importar arquivo');
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  const handleTurboMode = () => {
    toast.success('Modo Turbo ativado! ⚡', {
      icon: '⚡',
      duration: 3000
    });
    // Implementar lógica do modo turbo
  };

  return (
    <div className={`
      min-h-screen transition-colors duration-300
      ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}
    `}>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#1f2937',
          },
        }}
      />
      
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Header */}
      <header className={`
        sticky top-0 z-40
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
        border-b backdrop-blur-lg bg-opacity-90
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-2xl">💪</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                Be Stronger
              </h1>
              {treinoConquistas.length > 0 && (
                <div className="flex items-center gap-1 ml-2">
                  <Trophy size={16} className="text-yellow-500" />
                  <span className="text-sm">{treinoConquistas.length}</span>
                </div>
              )}
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative px-4 py-2 rounded-lg font-medium transition-colors
                      ${activeTab === tab.id
                        ? `text-${tab.color}-500`
                        : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <Icon size={18} />
                      {tab.label}
                    </div>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className={`
                          absolute inset-0 rounded-lg
                          bg-${tab.color}-500 bg-opacity-10
                          -z-10
                        `}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTurboMode}
                className={`
                  p-2 rounded-lg
                  ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
                  transition-colors
                `}
                title="Modo Turbo"
              >
                <Zap size={18} className="text-yellow-500" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className={`
                  p-2 rounded-lg
                  ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
                  transition-colors
                `}
                title="Exportar dados"
              >
                <Download size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleImport}
                className={`
                  p-2 rounded-lg
                  ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
                  transition-colors
                `}
                title="Importar dados"
              >
                <Upload size={18} />
              </motion.button>

              <ThemeToggle />

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-4 py-2 space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg
                        ${activeTab === tab.id
                          ? `bg-${tab.color}-500 bg-opacity-10 text-${tab.color}-500`
                          : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }
                      `}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'treino' && <TreinoTab />}
            {activeTab === 'alimentacao' && <AlimentacaoTab />}
            {activeTab === 'sono' && <SonoTab />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Tutorial Modal */}
      <Tutorial isOpen={showTutorial} onClose={() => setShowTutorial(false)} />

      {/* Export Modal */}
      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
      />
    </div>
  );
};

export default Dashboard;