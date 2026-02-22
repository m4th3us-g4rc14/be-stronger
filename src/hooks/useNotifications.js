import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export function useNotifications() {
  const [permission, setPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Seu navegador não suporta notificações');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  };

  const sendNotification = (title, options = {}) => {
    if (permission !== 'granted') {
      toast.error('Permissão de notificação não concedida');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/logo192.png',
        badge: '/logo192.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        if (options.onClick) options.onClick();
      };

      return notification;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  };

  const checkAndNotifyLembretes = (lembretes) => {
    const agora = new Date();
    const horaAtual = agora.getHours().toString().padStart(2, '0');
    const minutoAtual = agora.getMinutes().toString().padStart(2, '0');
    const horarioAtual = `${horaAtual}:${minutoAtual}`;

    lembretes.forEach(lembrete => {
      if (lembrete.ativo && lembrete.horario === horarioAtual) {
        sendNotification('Hora de dormir! 🛌', {
          body: 'Mantenha sua rotina de sono para melhores resultados.',
          tag: 'sono-lembrete'
        });
      }
    });
  };

  return {
    permission,
    requestPermission,
    sendNotification,
    checkAndNotifyLembretes
  };
}