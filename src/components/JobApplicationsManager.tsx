import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, User, FileText, Calendar, Phone, Check, X, Trash2, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getCurrentUser } from '../lib/auth';

interface JobApplication {
  id: string;
  full_name: string;
  cpf: string;
  age: number;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface JobApplicationsManagerProps {
  onClose: () => void;
}

const JobApplicationsManager: React.FC<JobApplicationsManagerProps> = ({ onClose }) => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching job applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app =>
        app.full_name.toLowerCase().includes(term) ||
        app.cpf.includes(term) ||
        app.phone.includes(term)
      );
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      const application = applications.find(app => app.id === applicationId);
      if (application) {
        await supabase
          .from('notifications')
          .insert({
            type: 'general',
            message: `Candidatura de ${application.full_name} foi ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'} por ${currentUser?.full_name}`,
            is_read: false
          });
      }

      alert(`Candidatura ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso!`);
    } catch (error) {
      console.error('Error updating application status:', error);
      alert('Erro ao atualizar status da candidatura');
    }
  };

  const deleteApplication = async (applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    if (!confirm(`Tem certeza que deseja excluir a candidatura de ${application.full_name}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(prev => prev.filter(app => app.id !== applicationId));

      alert('Candidatura excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Erro ao excluir candidatura');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-400 bg-green-600/10 border-green-600';
      case 'rejected': return 'text-red-400 bg-red-600/10 border-red-600';
      default: return 'text-yellow-400 bg-yellow-600/10 border-yellow-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovada';
      case 'rejected': return 'Rejeitada';
      default: return 'Pendente';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-xl p-8 border border-blue-600">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
            <p className="text-white">Carregando candidaturas...</p>
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
        className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-blue-600"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Candidaturas de Emprego</h2>
              <p className="text-blue-100">Gerenciar inscrições do "Venha Trabalhar Conosco"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, CPF ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-600 focus:outline-none"
              >
                <option value="all">Todos os Status</option>
                <option value="pending">Pendentes</option>
                <option value="approved">Aprovadas</option>
                <option value="rejected">Rejeitadas</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            Mostrando {filteredApplications.length} de {applications.length} candidaturas
          </div>
        </div>

        {/* Applications List */}
        <div className="p-6">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'Nenhuma candidatura encontrada' : 'Nenhuma candidatura recebida'}
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'As candidaturas aparecerão aqui quando alguém se inscrever'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-black/50 rounded-xl p-6 border border-gray-800 hover:border-blue-600 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Application Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <User className="h-5 w-5 text-blue-400" />
                        <h3 className="text-xl font-bold text-white">{application.full_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(application.status)}`}>
                          {getStatusLabel(application.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-green-400" />
                          <div>
                            <span className="text-gray-400">CPF:</span>
                            <p className="text-white font-medium">{application.cpf}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-yellow-400" />
                          <div>
                            <span className="text-gray-400">Idade:</span>
                            <p className="text-white font-medium">{application.age} anos</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-purple-400" />
                          <div>
                            <span className="text-gray-400">Telefone:</span>
                            <p className="text-white font-medium">{application.phone}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">Data:</span>
                          <p className="text-white font-medium">
                            {new Date(application.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(application.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                          >
                            <Check className="h-4 w-4" />
                            <span>Aprovar</span>
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                          >
                            <X className="h-4 w-4" />
                            <span>Rejeitar</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteApplication(application.id)}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-medium transition-colors"
                        title="Excluir candidatura"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-6">
          <div className="flex
