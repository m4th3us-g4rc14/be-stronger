import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Dumbbell, Utensils, Moon, Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Tutorial = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const steps = [
    {
      title: "Bem-vindo ao Be Stronger!",
      content: "Seu personal trainer digital para uma vida mais saudável e forte.",
      icon: "💪",
      color: "primary"
    },
    {
      title: "Aba Treino",
      content: "Registre seus treinos, acompanhe evolução de cargas e desbloqueie conquistas.",
      icon: <Dumbbell className="w-12 h-12" />,
      color: "primary"
    },
    {
      title: "Aba Alimentação",
      content: "Monitore suas refeições, calorias e macros. Alcance seus objetivos nutricionais.",
      icon: <Utensils className="w-12 h-12" />,
      color: "green"
    },
    {
      title: "Aba Sono",
      content: "Acompanhe a qualidade do seu sono, defina lembretes e melhore seu descanso.",
      icon: <Moon className="w-12 h-12" />,
      color: "indigo"
    },
    {
      title: "Conquistas e Desafios",
      content: "Ganhe medalhas, mantenha streaks e seja recompensado pela sua consistência!",
      icon: <Award className="w-12 h-12" />,
      color: "yellow"
    }
  ];

  const handleComplete = () => {
    localStorage.setItem('tutorialVisto', 'true');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className={`
            w-full max-w-md rounded-xl overflow-hidden
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            shadow-2xl
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`
            relative p-6 text-center
            bg-gradient-to-r from-${steps[step-1].color}-500 to-${steps[step-1].color}-600
            text-white
          `}>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="text-6xl mb-4 flex justify-center">
              {typeof steps[step-1].icon === 'string' 
                ? steps[step-1].icon 
                : steps[step-1].icon}
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {steps[step-1].title}
            </h2>

            <p className="text-white/90">
              {steps[step-1].content}
            </p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-2 h-2 rounded-full transition-all
                    ${i + 1 === step 
                      ? 'w-8 bg-white' 
                      : 'bg-white/50'
                    }
                  `}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6">
            <div className="flex justify-between gap-4">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    ${isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-200 hover:bg-gray-300'
                    } transition-colors
                  `}
                >
                  <ChevronLeft size={18} />
                  Anterior
                </button>
              ) : (
                <div />
              )}

              {step < totalSteps ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Próximo
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="px-6 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors"
                >
                  Começar!
                </button>
              )}
            </div>

            {/* Skip link */}
            <button
              onClick={handleComplete}
              className="w-full mt-4 text-sm opacity-50 hover:opacity-100 transition-opacity"
            >
              Pular tutorial
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Tutorial;