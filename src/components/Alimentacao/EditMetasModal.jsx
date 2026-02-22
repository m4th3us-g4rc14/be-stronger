import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { useAlimentacao } from '../../context/AlimentacaoContext';
import { useTheme } from '../../context/ThemeContext';

const EditMetasModal = ({ isOpen, onClose }) => {
  const { metas, setMetas } = useAlimentacao();
  const { isDarkMode } = useTheme();
  
  const [formData, setFormData] = useState({
    calorias: metas.calorias,
    proteinas: metas.proteinas,
    carboidratos: metas.carboidratos,
    gorduras: metas.gorduras,
    objetivo: metas.objetivo
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setMetas(formData);
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
            w-full max-w-md rounded-xl
            ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
            shadow-2xl
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-xl font-semibold">Editar Metas Nutricionais</h3>
              <button type="button" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Objetivo</label>
                <select
                  value={formData.objetivo}
                  onChange={(e) => setFormData({ ...formData, objetivo: e.target.value })}
                  className="w-full p-2 rounded border"
                >
                  <option value="emagrecer">Emagrecer</option>
                  <option value="ganharMassa">Ganhar Massa</option>
                  <option value="manter">Manter</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Calorias (kcal)</label>
                <input
                  type="number"
                  value={formData.calorias}
                  onChange={(e) => setFormData({ ...formData, calorias: Number(e.target.value) })}
                  className="w-full p-2 rounded border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Proteínas (g)</label>
                <input
                  type="number"
                  value={formData.proteinas}
                  onChange={(e) => setFormData({ ...formData, proteinas: Number(e.target.value) })}
                  className="w-full p-2 rounded border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Carboidratos (g)</label>
                <input
                  type="number"
                  value={formData.carboidratos}
                  onChange={(e) => setFormData({ ...formData, carboidratos: Number(e.target.value) })}
                  className="w-full p-2 rounded border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Gorduras (g)</label>
                <input
                  type="number"
                  value={formData.gorduras}
                  onChange={(e) => setFormData({ ...formData, gorduras: Number(e.target.value) })}
                  className="w-full p-2 rounded border"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                Salvar
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditMetasModal;