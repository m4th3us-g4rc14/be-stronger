import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatarData = (data, formato = 'dd/MM/yyyy') => {
  return format(new Date(data), formato, { locale: ptBR });
};

export const formatarHorario = (horario) => {
  return horario;
};

export const formatarPeso = (peso) => {
  return `${peso} kg`;
};

export const formatarCalorias = (calorias) => {
  return `${calorias} kcal`;
};

export const formatarTempoRelativo = (data) => {
  return formatDistance(new Date(data), new Date(), { 
    locale: ptBR,
    addSuffix: true 
  });
};

export const formatarNumero = (numero, casas = 1) => {
  return numero.toFixed(casas);
};

export const formatarVolume = (volume) => {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M kg`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}k kg`;
  }
  return `${volume} kg`;
};