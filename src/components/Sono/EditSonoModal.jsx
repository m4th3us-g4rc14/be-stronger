import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Clock, Calendar, Moon, Sun, Activity, Heart } from 'lucide-react';
import { useSono } from '../../context/SonoContext';
import { useTheme } from '../../context/ThemeContext';
import { format } from 'date-fns';
import toast from 'react-hot-toast'; // ✅ IMPORT ADICIONADO

const EditSonoModal = ({ isOpen, onClose }) => {
  const { registros, adicionarRegistro, metaSono } = useSono();
  const { isDarkMode } = useTheme();
  
  const hoje = format(new Date(), 'yyyy-MM-dd');
  const registroHoje = registros[hoje] || {};

  const [formData, setFormData] = useState({
    data: hoje,
    inicio: registroHoje.inicio || '22:30',
    fim: registroHoje.fim || '06:30',
    qualidade: registroHoje.qualidade || 7,
    notas: registroHoje.notas || '',
    interrupcoes: registroHoje.interrupcoes || 0
  });

  // ✅ FUNÇÃO calcularDuracao DEFINIDA ANTES DE SER USADA
  const calcularDuracao = () => {
    const [hInicio, mInicio] = formData.inicio.split(':').map(Number);
    const [hFim, mFim] = formData.fim.split(':').map(Number);
    
    let horas = hFim - hInicio;
    let minutos = mFim - mInicio;
    
    if (horas < 0) horas += 24;
    
    return Number((horas + minutos / 60).toFixed(1));
  };

  // ✅ handleSubmit CORRIGIDO (usando duracaoCalculada)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar se os campos estão preenchidos
    if (!formData.inicio || !formData.fim) {
      alert('Preencha os horários de dormir e acordar');
      return;
    }
    
    // ✅ CHAMAR a função e guardar em uma variável
    const duracaoCalculada = calcularDuracao();
    
    const registro = {
      ...formData,
      duracao: duracaoCalculada, // ✅ USAR duracaoCalculada
      profundo: duracaoCalculada * 0.4,
      rem: duracaoCalculada * 0.25,
      leve: duracaoCalculada * 0.35
    };
    
    adicionarRegistro(formData.data, registro);
    toast.success('Registro de sono salvo! 😴');
    onClose();
  };

  // ✅ FUNÇÃO para calcular duração em tempo real (opcional, para exibir)
  const duracaoAtual = calcularDuracao();

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
            w-full max-w-md rounded-xl
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            shadow-2xl
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className={`
              flex items-center justify-between p-4 border-b
              ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <h3 className="text-xl font-semibold">
                Registrar Sono
              </h3>
              
              <button
                type="button"
                onClick={onClose}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Data */}
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Calendar size={16} />
                  Data
                </label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className={`
                    w-full px-3 py-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                    border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                  `}
                />
              </div>

              {/* Horários */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <Moon size={16} />
                    Dormiu
                  </label>
                  <input
                    type="time"
                    value={formData.inicio}
                    onChange={(e) => setFormData({ ...formData, inicio: e.target.value })}
                    className={`
                      w-full px-3 py-2 rounded-lg
                      ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                      border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                      focus:outline-none focus:ring-2 focus:ring-indigo-500
                    `}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    <Sun size={16} />
                    Acordou
                  </label>
                  <input
                    type="time"
                    value={formData.fim}
                    onChange={(e) => setFormData({ ...formData, fim: e.target.value })}
                    className={`
                      w-full px-3 py-2 rounded-lg
                      ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                      border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                      focus:outline-none focus:ring-2 focus:ring-indigo-500
                    `}
                  />
                </div>
              </div>

              {/* Duração calculada - AGORA USA duracaoAtual */}
              <div className={`
                p-3 rounded-lg text-center
                ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
              `}>
                <p className="text-sm opacity-70">Duração total</p>
                <p className="text-2xl font-bold text-indigo-500">
                  {duracaoAtual.toFixed(1)} horas
                </p>
                {duracaoAtual < metaSono && (
                  <p className="text-xs text-warning mt-1">
                    ⚠️ Abaixo da meta de {metaSono}h
                  </p>
                )}
              </div>

              {/* Qualidade */}
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <Heart size={16} />
                  Qualidade do Sono
                </label>
                
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.qualidade}
                    onChange={(e) => setFormData({ ...formData, qualidade: parseInt(e.target.value) })}
                    className="flex-1"
                  />
                  <span className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold
                    ${formData.qualidade >= 8 ? 'bg-green-500' :
                      formData.qualidade >= 6 ? 'bg-yellow-500' :
                      formData.qualidade >= 4 ? 'bg-orange-500' : 'bg-red-500'}
                    text-white
                  `}>
                    {formData.qualidade}
                  </span>
                </div>

                <div className="flex justify-between text-xs mt-1">
                  <span>😴 Péssimo</span>
                  <span>😊 Excelente</span>
                </div>
              </div>

              {/* Interrupções */}
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Activity size={16} />
                  Interrupções durante a noite
                </label>
                <select
                  value={formData.interrupcoes}
                  onChange={(e) => setFormData({ ...formData, interrupcoes: parseInt(e.target.value) })}
                  className={`
                    w-full px-3 py-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                    border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                  `}
                >
                  <option value="0">Nenhuma</option>
                  <option value="1">1 vez</option>
                  <option value="2">2 vezes</option>
                  <option value="3">3 vezes</option>
                  <option value="4">4+ vezes</option>
                </select>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Notas (sonhos, observações)
                </label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  rows="3"
                  placeholder="Registre aqui seus sonhos ou qualquer observação sobre a noite..."
                  className={`
                    w-full px-3 py-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                    border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                    resize-none
                  `}
                />
              </div>

              {/* Simulação de integração com wearable */}
              <div className={`
                p-3 rounded-lg border-2 border-dashed
                ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                text-center
              `}>
                <p className="text-sm mb-2">📱 Integração com Wearable</p>
                <button
                  type="button"
                  onClick={() => {
                    // Simular importação de dados
                    setFormData({
                      ...formData,
                      inicio: '22:45',
                      fim: '06:15',
                      qualidade: 8
                    });
                  }}
                  className="text-indigo-500 hover:text-indigo-600 text-sm"
                >
                  Simular importação do Apple Watch
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className={`
              flex justify-end gap-2 p-4 border-t
              ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
            `}>
              <button
                type="button"
                onClick={onClose}
                className={`
                  px-4 py-2 rounded-lg
                  ${isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors
                `}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Salvar Registro
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditSonoModal;