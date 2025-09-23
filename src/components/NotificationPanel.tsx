import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, User, Phone, Calendar, FileText, Trash2 } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data: {
    nome: string;
    rg: string;
    idade: string;
    telefone: string;
  };
  timestamp: string;
}

const NotificationPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Carregar notificações do localStorage
    const loadNotifications = () => {
      const stored = localStorage.getItem('mechanic_notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    };

    loadNotifications();

    // Verificar por novas notificações a cada 5 segundos
    const interval = setInterval(loadNotifications, 5000);

    return () => clearInterval(interval);
  }, []);

  const deleteNotification = (id: number) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    localStorage.setItem('mechanic_notifications', JSON.stringify(updated));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('mechanic_notifications');
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  return (
    <>
      {/* Notification Button */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 p-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110"
        >
          <Bell className="h-6 w-6 text-white" />
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, x: 300 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: 300 }}
              className="bg-gradient-to-br from-gray-900 to-black max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-red-600/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 p-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-6 w-6 text-white" />
                  <div>
                    <h2 className="text-2xl font-black text-white">Painel de Notificações</h2>
                    <p className="text-red-100">{notifications.length} candidatura(s) recebida(s)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="p-2 hover:bg-red-800 rounded-full transition-colors"
                      title="Limpar todas"
                    >
                      <Trash2 className="h-5 w-5 text-white" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-red-800 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-400 mb-2">Nenhuma notificação</h3>
                    <p className="text-gray-500">Quando alguém se candidatar, aparecerá aqui</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-red-600/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{notification.title}</h3>
                            <p className="text-gray-400 text-sm">{formatDate(notification.timestamp)}</p>
                          </div>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 hover:bg-red-600 rounded-full transition-colors"
                          >
                            <X className="h-4 w-4 text-gray-400 hover:text-white" />
                          </button>
                        </div>

                        <p className="text-gray-300 mb-4">{notification.message}</p>

                        {/* Candidate Details */}
                        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                          <h4 className="text-white font-bold mb-3">Dados do Candidato:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-blue-400" />
                              <span className="text-gray-300 text-sm">
                                <strong>Nome:</strong> {notification.data.nome}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-green-400" />
                              <span className="text-gray-300 text-sm">
                                <strong>RG:</strong> {notification.data.rg}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-yellow-400" />
                              <span className="text-gray-300 text-sm">
                                <strong>Idade:</strong> {notification.data.idade} anos
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-red-400" />
                              <span className="text-gray-300 text-sm">
                                <strong>Telefone:</strong> {notification.data.telefone}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 mt-4">
                          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                            Entrar em Contato
                          </button>
                          <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                            Arquivar
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationPanel;
