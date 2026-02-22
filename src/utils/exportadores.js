import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const exportarParaPDF = (dados, tipo) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.text(`Be Stronger - Relatório de ${tipo}`, 20, 20);
  
  // Data
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`, 20, 30);
  
  return doc;
};

export const exportarParaJSON = (dados) => {
  const data = {
    ...dados,
    exportadoEm: new Date().toISOString(),
    versao: '1.0.0'
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  return URL.createObjectURL(blob);
};

export const exportarParaCSV = (dados, cabecalho) => {
  const linhas = [
    cabecalho.join(','),
    ...dados.map(item => 
      cabecalho.map(campo => item[campo] || '').join(',')
    )
  ];
  
  const blob = new Blob([linhas.join('\n')], { type: 'text/csv' });
  return URL.createObjectURL(blob);
};