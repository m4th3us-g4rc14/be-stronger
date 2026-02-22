import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Image, FileJson, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useTreino } from '../../context/TreinoContext';
import { useAlimentacao } from '../../context/AlimentacaoContext';
import { useSono } from '../../context/SonoContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

const ExportModal = ({ isOpen, onClose }) => {
  const { isDarkMode } = useTheme();
  const { treinos, volumeTotal } = useTreino();
  const { refeicoes, totais } = useAlimentacao();
  const { registros, mediaSemanal } = useSono();
  
  const [exportType, setExportType] = useState('pdf');
  const [dateRange, setDateRange] = useState('semana');

  const handleExport = () => {
    switch(exportType) {
      case 'pdf':
        exportPDF();
        break;
      case 'json':
        exportJSON();
        break;
      case 'image':
        exportImage();
        break;
      case 'email':
        exportEmail();
        break;
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('Be Stronger - Relatório Semanal', 20, 20);
    
    // Data
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`, 20, 30);
    
    // Resumo
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Resumo da Semana', 20, 45);
    
    doc.setFontSize(11);
    doc.text(`🏋️ Volume Total: ${(volumeTotal / 1000).toFixed(1)}k kg`, 25, 55);
    doc.text(`🍽️ Calorias Médias: ${Math.round(totais.calorias)} kcal/dia`, 25, 62);
    doc.text(`😴 Média de Sono: ${mediaSemanal}h/dia`, 25, 69);
    
    // Tabela de Treinos
    doc.text('Treinos da Semana', 20, 85);
    
    const treinosData = [];
    Object.entries(treinos).forEach(([dia, treino]) => {
      if (treino.exercicios?.length > 0) {
        treinosData.push([
          dia.charAt(0).toUpperCase() + dia.slice(1),
          treino.tipo,
          treino.exercicios.length,
          treino.exercicios.filter(ex => ex.realizado).length
        ]);
      }
    });
    
    doc.autoTable({
      startY: 90,
      head: [['Dia', 'Tipo', 'Exercícios', 'Realizados']],
      body: treinosData,
    });
    
    // Salvar
    doc.save('be-stronger-relatorio.pdf');
    toast.success('PDF gerado com sucesso!');
    onClose();
  };

  const exportJSON = () => {
    const data = {
      treinos,
      refeicoes,
      sono: registros,
      exportadoEm: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `be-stronger-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    
    toast.success('Backup exportado com sucesso!');
    onClose();
  };

  const exportImage = () => {
    toast.success('Funcionalidade de exportar imagem simulada! 📸');
    onClose();
  };

  const exportEmail = () => {
    const email = prompt('Digite seu e-mail para receber o relatório:');
    if (email) {
      toast.success(`Relatório enviado para ${email}! (simulado)`);
      onClose();
    }
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
          {/* Header */}
          <div className={`
            flex items-center justify-between p-4 border-b
            ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <h3 className="text-xl font-semibold">
              Exportar Dados
            </h3>
            
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Tipo de exportação */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Formato
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setExportType('pdf')}
                  className={`
                    p-3 rounded-lg flex flex-col items-center gap-2
                    ${exportType === 'pdf'
                      ? 'bg-primary-500 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }
                    transition-colors
                  `}
                >
                  <FileText size={24} />
                  <span>PDF</span>
                </button>
                
                <button
                  onClick={() => setExportType('json')}
                  className={`
                    p-3 rounded-lg flex flex-col items-center gap-2
                    ${exportType === 'json'
                      ? 'bg-primary-500 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }
                    transition-colors
                  `}
                >
                  <FileJson size={24} />
                  <span>JSON</span>
                </button>
                
                <button
                  onClick={() => setExportType('image')}
                  className={`
                    p-3 rounded-lg flex flex-col items-center gap-2
                    ${exportType === 'image'
                      ? 'bg-primary-500 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }
                    transition-colors
                  `}
                >
                  <Image size={24} />
                  <span>Imagem</span>
                </button>
                
                <button
                  onClick={() => setExportType('email')}
                  className={`
                    p-3 rounded-lg flex flex-col items-center gap-2
                    ${exportType === 'email'
                      ? 'bg-primary-500 text-white'
                      : isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }
                    transition-colors
                  `}
                >
                  <Mail size={24} />
                  <span>E-mail</span>
                </button>
              </div>
            </div>

            {/* Período */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Período
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className={`
                  w-full px-3 py-2 rounded-lg
                  ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                  border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                `}
              >
                <option value="semana">Última semana</option>
                <option value="mes">Último mês</option>
                <option value="ano">Último ano</option>
                <option value="tudo">Todo período</option>
              </select>
            </div>

            {/* Informações adicionais */}
            <div className={`
              p-3 rounded-lg text-sm
              ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
            `}>
              <p className="font-medium mb-1">📊 Resumo do período:</p>
              <p>Treinos realizados: {Object.values(treinos).filter(d => 
                d.exercicios?.some(ex => ex.realizado)
              ).length}</p>
              <p>Média de calorias: {Math.round(totais.calorias)} kcal</p>
              <p>Média de sono: {mediaSemanal}h</p>
            </div>
          </div>

          {/* Footer */}
          <div className={`
            flex justify-end gap-2 p-4 border-t
            ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
          `}>
            <button
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
              onClick={handleExport}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              Exportar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExportModal;