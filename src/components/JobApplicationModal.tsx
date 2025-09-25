import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, FileText, Calendar, Phone, Send, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface JobApplicationModalProps {
  onClose: () => void;
}

const JobApplicationModal: React.FC<JobApplicationModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    telefone: '',
    id_game: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validações básicas
    if (!formData.nome || !formData.idade || !formData.telefone || !formData.id_game) {
      setError('Todos os campos são obrigatórios');
      setIsSubmitting(false);
      return;
    }

    // Validar idade
    const idade = parseInt(formData.idade);
    if (isNaN(idade) || idade < 18 || idade > 70) {
      setError('Idade deve ser entre 18 e 70 anos');
      setIsSubmitting(false);
      return;
    }

    // Validar telefone
    const telefoneRegex = /^\d+$/; // Aceitar qualquer quantidade de números
    if (!telefoneRegex.test(formData.telefone)) {
      setError('Telefone deve conter apenas números');
      setIsSubmitting(false);
      return;
    }

    // Validar ID game
    const idGame = /^\d+$/; // Aceitar qualquer quantidade de números
    if (!idGame.test(formData.id_game)) {
      setError('ID deve conter apenas números');
      setIsSubmitting(false);
      return;
    }

    try {
      // Salvar candidatura na tabela job_applications
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert([
          {
            full_name: formData.nome,
            id_game: parseInt(formData.id_game),
            age: parseInt(formData.idade),
            phone: formData.telefone,
            status: "pending"
          }
        ]);

      if (insertError) {
        console.error('Erro ao inserir candidatura:', insertError);
        throw insertError;
      }

      // Criar notificação para informar sobre nova candidatura
      await supabase
        .from('notifications')
        .insert({
          type: 'job_application',
          message: `Nova candidatura recebida: ${formData.nome} (ID: ${formData.id_game}, Idade: ${formData.idade}, Tel: ${formData.telefone})`,
          is_read: false
        });

      // Limpar formulário
      setFormData({
        nome: '',
        id_game: '',
        idade: '',
        telefone: ''
      });

      setSuccess(true);
      
      // Fechar modal após 3 segundos
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Erro ao enviar candidatura:', error);
      setError('Erro ao enviar candidatura. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    // Permitir qualquer quantidade de números
    if (numbers.length >= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length >= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
      return numbers;
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-green-600 text-center"
        >
          <div className="text-green-600 mb-4">
            <Users className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Candidatura Enviada!
          </h3>
          <p className="text-gray-400 mb-6">
            Sua candidatura foi enviada com sucesso. Nossa equipe de RH entrará em contato em breve.
          </p>
          <div className="bg-green-600/10 border border-green-600 rounded-lg p-4">
            <p className="text-green-400 text-sm">
              ✓ Notificação enviada para a equipe<br/>
              ✓ Dados registrados no sistema<br/>
              ✓ Aguarde nosso contato
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-xl p-8 max-w-md w-full border border-green-600"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-2 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Venha Trabalhar Conosco</h3>
              <p className="text-green-400 text-sm">Mecânica Guaianases - GuaianaseRP</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Info */}
        <div className="bg-green-600/10 border border-green-600 rounded-lg p-4 mb-6">
          <h4 className="text-green-400 font-bold mb-2">🚗 Oportunidade de Emprego</h4>
          <p className="text-green-300 text-sm">
            Estamos sempre em busca de profissionais qualificados para integrar nossa equipe. 
            Preencha o formulário abaixo e nossa equipe de RH entrará em contato.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Nome (in-game)
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-600 focus:outline-none"
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              Idade
            </label>
            <input
              type="number"
              value={formData.idade}
              onChange={(e) => setFormData(prev => ({ ...prev, idade: e.target.value }))}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-600 focus:outline-none"
              placeholder="Ex: 25"
              min="18"
              max="70"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              ID (in game)
            </label>
            <input
              type="text"
              value={formData.id_game}
              onChange={(e) => setFormData(prev => ({ ...prev, id_game: e.target.value }))}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-600 focus:outline-none"
              placeholder="Digite apenas números"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              <Phone className="h-4 w-4 inline mr-2" />
              Telefone in-game
            </label>
            <input
              type="text"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: formatPhone(e.target.value) }))}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-green-600 focus:outline-none"
              placeholder="Digite apenas números"
              required
            />
          </div>

          {error && (
            <div className="bg-red-600/10 border border-red-600 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Candidatura
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-xs">
            Ao enviar esta candidatura, você concorda que seus dados sejam utilizados 
            para fins de recrutamento pela Mecânica Guaianases.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default JobApplicationModal;
