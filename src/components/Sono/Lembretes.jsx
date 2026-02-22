import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, X, Clock, Trash2 } from 'lucide-react';
import { useSono } from '../../context/SonoContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../hooks/useNotifications';

const Lembretes = () => {
  const { lembretes, toggleLembrete, adicionarLembrete, removerLembrete } = useSono();
  const { isDarkMode } = useTheme();
  const { requestPermission, sendNotification } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [novoLembrete, setNovoLembrete] = useState({
    horario: '22:00',
    dias: ['seg', 'ter', 'qua', 'qui', 'sex']
  });

  const diasSemana = [
    { id: 'seg', label: 'Seg' },
    { id: 'ter', label: 'Ter' },
    { id: 'qua', label: 'Qua' },
    { id: 'qui', label: 'Qui' },
    { id: 'sex', label: 'Sex' },
    { id: 'sab', label: 'Sáb' },
    { id: 'dom', label: 'Dom' }
  ];

  const toggleDia = (diaId) => {
    setNovoLembrete(prev => ({
      ...prev,
      dias: prev.dias.includes(diaId)
        ? prev.dias.filter(d => d !== diaId)
        : [...prev.dias, diaId]
    }));
  };

  const handleAddLembrete = () => {
    if (novoLembrete.dias.length === 0) {
      alert('Selecione pelo menos um dia da semana');
      return;
    }

    adicionarLembrete({
      ...novoLembrete,
      ativo: true
    });

    setShowForm(false);
    setNovoLembrete({
      horario: '22:00',
      dias: ['seg', 'ter', 'qua', 'qui', 'sex']
    });

    // Solicitar permissão de notificação
    requestPermission();
  };

  const testarNotificacao = () => {
    sendNotification('Hora de dormir! 🛌', {
      body: 'Mantenha sua rotina de sono para melhores resultados.'
    });
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Lembretes de Sono
        </h3>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className={`
            p-2 rounded-lg
            ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
            transition-colors
          `}
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Formulário de novo lembrete */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`
              p-4 rounded-lg overflow-hidden
              ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
            `}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Horário
                </label>
                <input
                  type="time"
                  value={novoLembrete.horario}
                  onChange={(e) => setNovoLembrete({ ...novoLembrete, horario: e.target.value })}
                  className={`
                    w-full px-3 py-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}
                    border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                  `}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Dias da semana
                </label>
                <div className="flex flex-wrap gap-2">
                  {diasSemana.map(dia => (
                    <button
                      key={dia.id}
                      type="button"
                      onClick={() => toggleDia(dia.id)}
                      className={`
                        w-10 h-10 rounded-full text-sm font-medium
                        ${novoLembrete.dias.includes(dia.id)
                          ? 'bg-primary-500 text-white'
                          : isDarkMode
                            ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                            : 'bg-white text-gray-700 hover:bg-gray-200'
                        }
                        transition-colors
                      `}
                    >
                      {dia.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowForm(false)}
                  className={`
                    flex-1 px-3 py-2 rounded-lg
                    ${isDarkMode 
                      ? 'bg-gray-600 hover:bg-gray-500' 
                      : 'bg-gray-300 hover:bg-gray-400'
                    } transition-colors
                  `}
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleAddLembrete}
                  className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de lembretes */}
      <div className="space-y-2">
        {lembretes.map(lembrete => (
          <motion.div
            key={lembrete.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`
              flex items-center justify-between p-3 rounded-lg
              ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
            `}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleLembrete(lembrete.id)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${lembrete.ativo
                    ? 'bg-green-500 text-white'
                    : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                  }
                `}
              >
                <Bell size={16} />
              </button>
              
              <div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="opacity-50" />
                  <span className="font-medium">{lembrete.horario}</span>
                </div>
                
                <div className="flex gap-1 mt-1">
                  {diasSemana.map(dia => (
                    <span
                      key={dia.id}
                      className={`
                        text-xs px-1.5 py-0.5 rounded
                        ${lembrete.dias.includes(dia.id)
                          ? 'bg-primary-500 text-white'
                          : isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                        }
                      `}
                    >
                      {dia.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => removerLembrete(lembrete.id)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-danger"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Botão para testar notificação */}
      {lembretes.length > 0 && (
        <button
          onClick={testarNotificacao}
          className={`
            w-full mt-2 p-2 text-sm rounded-lg
            ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}
            transition-colors
          `}
        >
          Testar notificação
        </button>
      )}

      {/* Mensagem quando não há lembretes */}
      {lembretes.length === 0 && !showForm && (
        <div className="text-center py-8 opacity-50">
          <Bell size={32} className="mx-auto mb-2" />
          <p>Nenhum lembrete configurado</p>
          <p className="text-sm">Clique no + para adicionar</p>
        </div>
      )}
    </div>
  );
};

export default Lembretes;