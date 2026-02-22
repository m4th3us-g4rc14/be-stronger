import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2, Search, Camera } from 'lucide-react';
import { useAlimentacao } from '../../context/AlimentacaoContext';
import { useTheme } from '../../context/ThemeContext';
import { alimentosSugeridos } from '../../data/alimentos';

const EditRefeicaoModal = ({ isOpen, onClose, refeicaoKey }) => {
  const { refeicoes, adicionarAlimento, removerAlimento } = useAlimentacao();
  const { isDarkMode } = useTheme();
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [novoAlimento, setNovoAlimento] = useState({
    nome: '',
    quantidade: 100,
    calorias: 0,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0
  });

  const refeicao = refeicoes[refeicaoKey];

  const handleAddAlimento = () => {
    if (novoAlimento.nome) {
      adicionarAlimento(refeicaoKey, {
        ...novoAlimento,
        id: Date.now(),
        unidade: 'g'
      });
      setNovoAlimento({
        nome: '',
        quantidade: 100,
        calorias: 0,
        proteinas: 0,
        carboidratos: 0,
        gorduras: 0
      });
    }
  };

  const handleSelectSugestao = (alimento) => {
    adicionarAlimento(refeicaoKey, {
      ...alimento,
      id: Date.now(),
      quantidade: 100
    });
    setShowSugestoes(false);
  };

  const alimentosFiltrados = alimentosSugeridos.filter(a =>
    a.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calcularTotalRefeicao = () => {
    if (!refeicao?.alimentos) return { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 };
    
    return refeicao.alimentos.reduce((acc, alimento) => ({
      calorias: acc.calorias + (alimento.calorias * (alimento.quantidade / 100)),
      proteinas: acc.proteinas + (alimento.proteinas * (alimento.quantidade / 100)),
      carboidratos: acc.carboidratos + (alimento.carboidratos * (alimento.quantidade / 100)),
      gorduras: acc.gorduras + (alimento.gorduras * (alimento.quantidade / 100))
    }), { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
  };

  const totais = calcularTotalRefeicao();

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
            w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl
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
              Editando: {refeicaoKey === 'cafeDaManha' ? 'Café da Manhã' :
                        refeicaoKey === 'almoco' ? 'Almoço' :
                        refeicaoKey === 'lancheTarde' ? 'Lanche da Tarde' : 'Jantar'}
            </h3>
            
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Totais da refeição */}
            <div className={`
              mb-4 p-3 rounded-lg
              ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
            `}>
              <h4 className="font-semibold mb-2">Totais da Refeição</h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-xs opacity-70">Calorias</p>
                  <p className="font-bold text-success">{Math.round(totais.calorias)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Proteínas</p>
                  <p className="font-bold text-blue-500">{Math.round(totais.proteinas)}g</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Carbo</p>
                  <p className="font-bold text-yellow-500">{Math.round(totais.carboidratos)}g</p>
                </div>
                <div>
                  <p className="text-xs opacity-70">Gorduras</p>
                  <p className="font-bold text-orange-500">{Math.round(totais.gorduras)}g</p>
                </div>
              </div>
            </div>

            {/* Lista de alimentos atuais */}
            <h4 className="font-medium mb-2">Alimentos</h4>
            <div className="space-y-2 mb-4">
              {refeicao?.alimentos?.map((alimento, index) => (
                <motion.div
                  key={alimento.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`
                    flex items-center justify-between p-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
                  `}
                >
                  <div className="flex-1">
                    <span className="font-medium">{alimento.nome}</span>
                    <div className="flex gap-4 text-sm opacity-70">
                      <span>{alimento.quantidade}g</span>
                      <span>{alimento.calorias} kcal</span>
                      <span>P: {alimento.proteinas}g</span>
                      <span>C: {alimento.carboidratos}g</span>
                      <span>G: {alimento.gorduras}g</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removerAlimento(refeicaoKey, alimento.id)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Adicionar novo alimento */}
            <div className="space-y-4">
              <h4 className="font-medium">Adicionar Alimento</h4>
              
              {/* Busca de alimentos */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar alimentos..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSugestoes(true);
                  }}
                  onFocus={() => setShowSugestoes(true)}
                  className={`
                    w-full px-3 py-2 pl-10 rounded-lg
                    ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                    border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                  `}
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 opacity-50" />
              </div>

              {/* Sugestões de alimentos */}
              <AnimatePresence>
                {showSugestoes && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`
                      overflow-hidden rounded-lg border
                      ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}
                    `}
                  >
                    <div className="max-h-48 overflow-y-auto">
                      {alimentosFiltrados.map(alimento => (
                        <button
                          key={alimento.id}
                          onClick={() => handleSelectSugestao(alimento)}
                          className={`
                            w-full p-2 text-left
                            ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                            transition-colors
                            border-b last:border-b-0
                            ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
                          `}
                        >
                          <span className="font-medium">{alimento.nome}</span>
                          <span className="text-sm opacity-70 ml-2">
                            ({alimento.calorias} kcal/100g)
                          </span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Formulário manual */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Nome do alimento"
                  value={novoAlimento.nome}
                  onChange={(e) => setNovoAlimento({ ...novoAlimento, nome: e.target.value })}
                  className={`
                    col-span-2 px-3 py-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                    border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                  `}
                />
                
                <input
                  type="number"
                  placeholder="Quantidade (g)"
                  value={novoAlimento.quantidade}
                  onChange={(e) => setNovoAlimento({ ...novoAlimento, quantidade: e.target.value })}
                  className={`
                    px-3 py-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                    border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                  `}
                />
                
                <input
                  type="number"
                  placeholder="Calorias"
                  value={novoAlimento.calorias}
                  onChange={(e) => setNovoAlimento({ ...novoAlimento, calorias: e.target.value })}
                  className={`
                    px-3 py-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                    border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                  `}
                />
                
                <input
                  type="number"
                  placeholder="Proteínas"
                  value={novoAlimento.proteinas}
                  onChange={(e) => setNovoAlimento({ ...novoAlimento, proteinas: e.target.value })}
                  className={`
                    px-3 py-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                    border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                  `}
                />
                
                <input
                  type="number"
                  placeholder="Carboidratos"
                  value={novoAlimento.carboidratos}
                  onChange={(e) => setNovoAlimento({ ...novoAlimento, carboidratos: e.target.value })}
                  className={`
                    px-3 py-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                    border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                  `}
                />
                
                <input
                  type="number"
                  placeholder="Gorduras"
                  value={novoAlimento.gorduras}
                  onChange={(e) => setNovoAlimento({ ...novoAlimento, gorduras: e.target.value })}
                  className={`
                    px-3 py-2 rounded-lg
                    ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}
                    border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                  `}
                />

                <button
                  onClick={handleAddAlimento}
                  className="col-span-2 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Adicionar Alimento
                </button>
              </div>
            </div>

            {/* Botão para foto */}
            <div className="mt-4">
              <button
                onClick={() => {
                  // Simular upload de foto
                  alert('Funcionalidade de câmera simulada!');
                }}
                className={`
                  w-full p-3 rounded-lg border-2 border-dashed
                  ${isDarkMode 
                    ? 'border-gray-600 hover:border-gray-500 text-gray-400' 
                    : 'border-gray-300 hover:border-gray-400 text-gray-600'
                  } transition-colors flex items-center justify-center gap-2
                `}
              >
                <Camera size={18} />
                Adicionar Foto da Refeição
              </button>
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
              onClick={onClose}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Salvar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditRefeicaoModal;