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
        className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-auto border border-red-600"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-2 rounded-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Tabela de Preços dos Serviços</h2>
              <p className="text-red-400 text-sm">MECÂNICA GUAIANASES - GuaianaseRP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Legend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-green-600/10 border border-green-600 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Home className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-bold">Atendimento Interno</span>
              </div>
              <p className="text-green-300 text-sm">
                Serviços realizados dentro da oficina com toda estrutura disponível
              </p>
            </div>
            <div className="bg-yellow-600/10 border border-yellow-600 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-400 font-bold">Atendimento Externo</span>
              </div>
              <p className="text-yellow-300 text-sm">
                Serviços realizados no local do cliente (inclui deslocamento)
              </p>
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-600">
                  <th className="border border-gray-600 text-left p-4 text-white font-bold">
                    Serviço
                  </th>
                  <th className="border border-gray-600 text-left p-4 text-white font-bold">
                    Descrição
                  </th>
                  <th className="border border-gray-600 text-center p-4 text-white font-bold">
                    <div className="flex items-center justify-center space-x-2">
                      <Home className="h-4 w-4" />
                      <span>Interno</span>
                    </div>
                  </th>
                  <th className="border border-gray-600 text-center p-4 text-white font-bold">
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>Externo</span>
                    </div>
                  </th>
                  <th className="border border-gray-600 text-center p-4 text-white font-bold">
                    Observações
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr 
                    key={service.id} 
                    className={`${
                      index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-850'
                    } hover:bg-gray-700 transition-colors`}
                  >
                    <td className="border border-gray-600 p-4">
                      <div className="font-bold text-white">{service.name}</div>
                    </td>
                    <td className="border border-gray-600 p-4">
                      <div className="text-gray-300 text-sm">
                        {service.description || 'Serviço especializado'}
                      </div>
                    </td>
                    <td className="border border-gray-600 p-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 font-bold text-lg">
                          {Number(service.price_inshop || 0).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-600 p-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <DollarSign className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400 font-bold text-lg">
                          {Number(service.price_offsite || 0).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="border border-gray-600 p-4 text-center">
                      {service.requires_tow ? (
                        <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                          Requer Guincho
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-600/10 border border-blue-600 rounded-lg p-4">
              <h4 className="text-blue-400 font-bold mb-2">💡 Informações Importantes</h4>
              <ul className="text-blue-300 text-sm space-y-1">
                <li>• Preços podem variar conforme complexidade do serviço</li>
                <li>• Orçamento gratuito para todos os serviços</li>
                <li>• Garantia de 30 dias em todos os serviços</li>
                <li>• Peças com garantia do fabricante</li>
              </ul>
            </div>
            <div className="bg-red-600/10 border border-red-600 rounded-lg p-4">
              <h4 className="text-red-400 font-bold mb-2">📞 Contato e Agendamento</h4>
              <ul className="text-red-300 text-sm space-y-1">
                <li>• Atendimento 24 horas por dia</li>
                <li>• Agendamento via Discord ou telefone</li>
                <li>• Atendimento emergencial disponível</li>
                <li>• Desconto para clientes frequentes</li>
              </ul>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
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