import React from 'react';
import { motion } from 'framer-motion';
import { X, Wrench, MapPin, Home, DollarSign, AlertCircle } from 'lucide-react';
import { useServices } from '../hooks/useSupabase';

interface ServicesTableProps {
  onClose: () => void;
}

const ServicesTable: React.FC<ServicesTableProps> = ({ onClose }) => {
  const { services, loading, error } = useServices();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-xl p-8 border border-red-600">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4 mx-auto"></div>
            <p className="text-white">Carregando tabela de preços...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-xl p-8 border border-red-600 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-4">Erro ao Carregar</h3>
            <p className="text-gray-400 mb-6">Não foi possível carregar a tabela de preços.</p>
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900 via-black to-red-900/30 backdrop-blur-sm rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto border border-red-600/50 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-red-600/30 bg-gradient-to-r from-red-600/10 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-3 rounded-xl shadow-lg">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Tabela de Preços dos Serviços</h2>
              <p className="text-red-400 font-bold">MECÂNICA GUAIANASES - GuaianaseRP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-3 rounded-xl hover:bg-red-600/20 transition-all duration-300 transform hover:scale-110"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Legend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/10 backdrop-blur-sm border border-green-600/50 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="bg-green-600/30 p-2 rounded-lg">
                  <Home className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-green-400 font-black text-lg">Atendimento Interno</span>
              </div>
              <p className="text-green-300">
                Serviços realizados dentro da oficina com toda estrutura disponível
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/10 backdrop-blur-sm border border-yellow-600/50 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="bg-yellow-600/30 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                </div>
                <span className="text-yellow-400 font-black text-lg">Atendimento Externo</span>
              </div>
              <p className="text-yellow-300">
                Serviços realizados no local do cliente (inclui deslocamento)
              </p>
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-black/30 backdrop-blur-sm rounded-xl overflow-hidden shadow-2xl">
              <thead>
                <tr className="bg-gradient-to-r from-red-600 to-red-700">
                  <th className="border border-red-500/30 text-left p-6 text-white font-black text-lg">
                    Serviço
                  </th>
                  <th className="border border-red-500/30 text-left p-6 text-white font-black text-lg">
                    Descrição
                  </th>
                  <th className="border border-red-500/30 text-center p-6 text-white font-black text-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <Home className="h-5 w-5" />
                      <span>Interno</span>
                    </div>
                  </th>
                  <th className="border border-red-500/30 text-center p-6 text-white font-black text-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>Externo</span>
                    </div>
                  </th>
                  <th className="border border-red-500/30 text-center p-6 text-white font-black text-lg">
                    Observações
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr 
                    key={service.id} 
                    className={`${
                      index % 2 === 0 ? 'bg-black/40' : 'bg-gray-900/40'
                    } hover:bg-red-600/10 transition-all duration-300 group`}
                  >
                    <td className="border border-gray-600/30 p-6">
                      <div className="font-black text-white text-lg group-hover:text-red-400 transition-colors">{service.name}</div>
                    </td>
                    <td className="border border-gray-600/30 p-6">
                      <div className="text-gray-300 group-hover:text-gray-200 transition-colors">
                        {service.description || 'Serviço especializado'}
                      </div>
                    </td>
                    <td className="border border-gray-600/30 p-6 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <DollarSign className="h-5 w-5 text-green-400" />
                        <span className="text-green-400 font-black text-xl">
                          {Number(service.price_inshop || 0).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-600/30 p-6 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <DollarSign className="h-5 w-5 text-yellow-400" />
                        <span className="text-yellow-400 font-black text-xl">
                          {Number(service.price_offsite || 0).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-600/30 p-6 text-center">
                      {service.requires_tow ? (
                        <span className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-sm px-4 py-2 rounded-full font-bold shadow-lg">
                          Requer Guincho
                        </span>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/10 backdrop-blur-sm border border-blue-600/50 rounded-xl p-6 shadow-lg">
              <h4 className="text-blue-400 font-black text-lg mb-4 flex items-center space-x-2">
                <span>💡</span>
                <span>Informações Importantes</span>
              </h4>
              <ul className="text-blue-300 space-y-2">
                <li>• Preços podem variar conforme complexidade do serviço</li>
                <li>• Orçamento gratuito para todos os serviços</li>
                <li>• Garantia de 15 dias em todos os serviços</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-600/20 to-red-800/10 backdrop-blur-sm border border-red-600/50 rounded-xl p-6 shadow-lg">
              <h4 className="text-red-400 font-black text-lg mb-4 flex items-center space-x-2">
                <span>📞</span>
                <span>Contato e Agendamento</span>
              </h4>
              <ul className="text-red-300 space-y-2">
                <li>• Atendimento 08:00 a 23:00 Todos os dias</li>
                <li>• Atendimento emergencial disponível</li>
                <li>• Desconto para clientes frequentes</li>
              </ul>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-4 rounded-xl font-black text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Fechar Tabela
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServicesTable;
