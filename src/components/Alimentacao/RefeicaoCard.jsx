import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Camera, Edit2 } from 'lucide-react';
import { useAlimentacao } from '../../context/AlimentacaoContext';
import { useTheme } from '../../context/ThemeContext';

const RefeicaoCard = ({ refeicaoKey, label, horario, icon, index, onEdit }) => {
  const { refeicoes, toggleRefeicaoRealizada } = useAlimentacao();
  const { isDarkMode } = useTheme();
  
  const refeicao = refeicoes[refeicaoKey];

  const calcularTotalRefeicao = () => {
    if (!refeicao?.alimentos) return 0;
    return refeicao.alimentos.reduce((acc, alimento) => 
      acc + alimento.calorias * (alimento.quantidade / (alimento.quantidade || 1)), 0
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        rounded-lg overflow-hidden border
        ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
        ${refeicao?.realizado ? 'opacity-100' : 'opacity-70'}
      `}
    >
      {/* Cabeçalho */}
      <div 
        className={`
          flex items-center justify-between p-4 cursor-pointer
          ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
        `}
        onClick={() => toggleRefeicaoRealizada(refeicaoKey)}
      >
        <div className="flex items-center gap-3">
          {refeicao?.realizado ? (
            <CheckCircle className="w-6 h-6 text-success" />
          ) : (
            <XCircle className="w-6 h-6 text-gray-400" />
          )}
          
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-semibold">{label}</span>
          </div>
          
          <span className="text-sm opacity-70">{horario}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono bg-green-500 text-white px-2 py-1 rounded">
            {calcularTotalRefeicao()} kcal
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          >
            <Edit2 size={16} />
          </button>
        </div>
      </div>

      {/* Alimentos */}
      {refeicao?.alimentos?.length > 0 && (
        <div className="p-4 space-y-2">
          {refeicao.alimentos.map((alimento, idx) => (
            <div
              key={alimento.id}
              className={`
                flex items-center justify-between text-sm
                ${idx < refeicao.alimentos.length - 1 ? 'border-b pb-2' : ''}
                ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
              `}
            >
              <span>{alimento.nome}</span>
              <div className="flex gap-4">
                <span>{alimento.quantidade}{alimento.unidade || 'g'}</span>
                <span className="font-mono">{alimento.calorias} kcal</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Foto da refeição */}
      {refeicao?.foto && (
        <div className="p-4 pt-0">
          <img 
            src={refeicao.foto} 
            alt={label}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Botão para adicionar foto (quando não tem) */}
      {!refeicao?.foto && (
        <div className="p-4 pt-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Simular upload de foto
              alert('Funcionalidade de câmera simulada!');
            }}
            className={`
              w-full py-2 rounded-lg border-2 border-dashed
              ${isDarkMode 
                ? 'border-gray-600 hover:border-gray-500 text-gray-400' 
                : 'border-gray-300 hover:border-gray-400 text-gray-600'
              } transition-colors flex items-center justify-center gap-2
            `}
          >
            <Camera size={16} />
            Adicionar foto
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default RefeicaoCard;