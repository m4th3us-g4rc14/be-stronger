import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  Copy,
  Trash2,
  GripVertical,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTreino } from '../../context/TreinoContext';
import { useTheme } from '../../context/ThemeContext';
import { templatesTreino } from '../../data/templates';

const SortableItem = ({ exercicio, onToggle, onUpdate, onDuplicate, onDelete, isDarkMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: exercicio.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={`
        flex items-center gap-2 p-3 mb-2 rounded-lg
        ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}
        ${exercicio.realizado ? 'opacity-60' : ''}
        border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}
      `}
    >
      <div {...attributes} {...listeners} className="cursor-move">
        <GripVertical size={18} className="opacity-50" />
      </div>

      <input
        type="checkbox"
        checked={exercicio.realizado}
        onChange={() => onToggle(exercicio.id)}
        className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
      />

      <input
        type="text"
        value={exercicio.nome}
        onChange={(e) => onUpdate(exercicio.id, { nome: e.target.value })}
        className={`
          flex-1 px-2 py-1 rounded
          ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}
          border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'}
          focus:outline-none focus:ring-2 focus:ring-primary-500
        `}
        placeholder="Nome do exercício"
      />

      <div className="flex items-center gap-1">
        <input
          type="number"
          value={exercicio.series}
          onChange={(e) => onUpdate(exercicio.id, { series: parseInt(e.target.value) || 0 })}
          className={`
            w-16 px-2 py-1 rounded text-center
            ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}
            border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-primary-500
          `}
          placeholder="Séries"
        />
        <span className="opacity-50">x</span>
        <input
          type="number"
          value={exercicio.reps}
          onChange={(e) => onUpdate(exercicio.id, { reps: parseInt(e.target.value) || 0 })}
          className={`
            w-16 px-2 py-1 rounded text-center
            ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}
            border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-primary-500
          `}
          placeholder="Reps"
        />
        <span className="opacity-50">@</span>
        <input
          type="number"
          value={exercicio.carga}
          onChange={(e) => onUpdate(exercicio.id, { carga: parseInt(e.target.value) || 0 })}
          className={`
            w-20 px-2 py-1 rounded text-center
            ${isDarkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-900'}
            border ${isDarkMode ? 'border-gray-500' : 'border-gray-300'}
            focus:outline-none focus:ring-2 focus:ring-primary-500
          `}
          placeholder="Carga"
        />
        <span className="opacity-50">kg</span>
      </div>

      <button
        onClick={() => onDuplicate(exercicio)}
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
      >
        <Copy size={16} />
      </button>

      <button
        onClick={() => onDelete(exercicio.id)}
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors text-danger"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
};

const EditTreinoModal = ({ isOpen, onClose, day, onDayChange }) => {
  const { treinos, setTreinos, toggleRealizado, duplicarExercicio } = useTreino();
  const { isDarkMode } = useTheme();
  const [showTemplates, setShowTemplates] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
  const diaIndex = dias.indexOf(day);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = treinos[day].exercicios.findIndex(ex => ex.id === active.id);
      const newIndex = treinos[day].exercicios.findIndex(ex => ex.id === over.id);

      const novosExercicios = arrayMove(treinos[day].exercicios, oldIndex, newIndex);
      setTreinos(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          exercicios: novosExercicios
        }
      }));
    }
  };

  const handleUpdateExercicio = (exercicioId, novosDados) => {
    setTreinos(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercicios: prev[day].exercicios.map(ex =>
          ex.id === exercicioId ? { ...ex, ...novosDados } : ex
        )
      }
    }));
  };

  const handleDuplicate = (exercicio) => {
    duplicarExercicio(day, exercicio);
  };

  const handleDelete = (exercicioId) => {
    setTreinos(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercicios: prev[day].exercicios.filter(ex => ex.id !== exercicioId)
      }
    }));
  };

  const handleAddExercicio = () => {
    const novoExercicio = {
      id: Date.now(),
      nome: "Novo exercício",
      series: 3,
      reps: 10,
      carga: 0,
      realizado: false
    };

    setTreinos(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        exercicios: [...prev[day].exercicios, novoExercicio]
      }
    }));
  };

  const handleApplyTemplate = (template) => {
    const novosExercicios = template.exercicios.map((ex, index) => ({
      ...ex,
      id: Date.now() + index,
      realizado: false
    }));

    setTreinos(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        tipo: template.nome,
        exercicios: novosExercicios
      }
    }));
    
    setShowTemplates(false);
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
            w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => onDayChange(dias[(diaIndex - 1 + 7) % 7])}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <h3 className="text-xl font-semibold">
                Editando: {day.charAt(0).toUpperCase() + day.slice(1)}
              </h3>
              
              <button
                onClick={() => onDayChange(dias[(diaIndex + 1) % 7])}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Tipo de Treino (múltipla escolha) */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-2">
    Grupos Musculares (selecione quantos quiser)
  </label>
  <div className="flex flex-wrap gap-2">
    {['Peito', 'Costas', 'Pernas', 'Ombro', 'Braços', 'Cardio', 'Abdômen', 'Descanso'].map(grupo => (
      <button
        key={grupo}
        type="button"
        onClick={() => {
          const tiposAtuais = treinos[day]?.tipo ? treinos[day].tipo.split(', ') : [];
          let novosTipos;
          
          if (tiposAtuais.includes(grupo)) {
            // Remover
            novosTipos = tiposAtuais.filter(t => t !== grupo);
          } else {
            // Adicionar
            novosTipos = [...tiposAtuais, grupo];
          }
          
          setTreinos(prev => ({
            ...prev,
            [day]: { 
              ...prev[day], 
              tipo: novosTipos.join(', ') 
            }
          }));
        }}
        className={`
          px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
          ${treinos[day]?.tipo?.includes(grupo)
            ? 'bg-primary-500 text-white shadow-md scale-105'
            : isDarkMode 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }
        `}
      >
        {grupo}
        {treinos[day]?.tipo?.includes(grupo) && (
          <span className="ml-1">✓</span>
        )}
      </button>
    ))}
  </div>
  
  {/* Mostrar os grupos selecionados */}
  {treinos[day]?.tipo && (
    <div className="mt-2 text-sm text-primary-500">
      Selecionado: {treinos[day].tipo}
    </div>
  )}
</div>

            {/* Templates */}
            <div className="mb-4">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-primary-500 hover:text-primary-600 font-medium flex items-center gap-1"
              >
                <Plus size={16} />
                Usar template
              </button>
              
              <AnimatePresence>
                {showTemplates && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 grid grid-cols-2 gap-2 overflow-hidden"
                  >
                    {templatesTreino.map(template => (
                      <button
                        key={template.id}
                        onClick={() => handleApplyTemplate(template)}
                        className={`
                          p-3 rounded-lg text-left
                          ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}
                          transition-colors
                        `}
                      >
                        <h4 className="font-medium">{template.nome}</h4>
                        <p className="text-sm opacity-70">
                          {template.exercicios.length} exercícios
                        </p>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Lista de Exercícios */}
            <h4 className="font-medium mb-2">Exercícios</h4>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={treinos[day]?.exercicios?.map(ex => ex.id) || []}
                strategy={verticalListSortingStrategy}
              >
                <AnimatePresence>
                  {treinos[day]?.exercicios?.map(exercicio => (
                    <SortableItem
                      key={exercicio.id}
                      exercicio={exercicio}
                      onToggle={(id) => toggleRealizado(day, id)}
                      onUpdate={(id, data) => handleUpdateExercicio(id, data)}
                      onDuplicate={handleDuplicate}
                      onDelete={handleDelete}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </AnimatePresence>
              </SortableContext>
            </DndContext>

            {/* Botão Adicionar */}
            <button
              onClick={handleAddExercicio}
              className={`
                w-full mt-4 p-3 rounded-lg border-2 border-dashed
                ${isDarkMode 
                  ? 'border-gray-600 hover:border-gray-500 text-gray-400 hover:text-gray-300' 
                  : 'border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-700'
                } transition-colors flex items-center justify-center gap-2
              `}
            >
              <Plus size={18} />
              Adicionar Exercício
            </button>
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
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
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

export default EditTreinoModal;