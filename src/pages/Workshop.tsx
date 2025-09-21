import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calculator, FileText, Settings, Zap, Shield, Award, Clock, Users, Star } from 'lucide-react';
import { getCurrentUser, hasPermission } from '../lib/auth';
import ServiceCalculator from '../components/ServiceCalculator';

const Workshop: React.FC = () => {
  const currentUser = getCurrentUser();
  const canAccessWorkshop = hasPermission('access_workshop');

  if (!canAccessWorkshop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/20 to-transparent"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-black/50 backdrop-blur-sm rounded-2xl p-12 border border-red-600/50 shadow-2xl"
          >
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-6 rounded-full w-24 h-24 mx-auto mb-6 shadow-2xl">
              <Wrench className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Acesso Restrito</h2>
            <p className="text-gray-300 mb-6 text-lg">
              Apenas mecânicos aprovados podem acessar a oficina.
            </p>
            {!currentUser && (
              <p className="text-red-400 font-medium">
                Faça login como mecânico para continuar.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <Wrench className="h-8 w-8" />,
      title: 'Serviços Completos',
      description: 'Todos os serviços disponíveis com preços diferenciados para atendimento interno e externo',
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-red-600/10 border-red-600/30'
    },
    {
      icon: <Calculator className="h-8 w-8" />,
      title: 'Calculadora Avançada',
      description: 'Calcule preços com peças extras, taxas e descontos de forma automática',
      color: 'from-gray-600 to-gray-800',
      bgColor: 'bg-gray-600/10 border-gray-600/30'
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Notas Fiscais',
      description: 'Gere e imprima notas fiscais profissionais para todos os seus atendimentos',
      color: 'from-red-600 to-red-800',
      bgColor: 'bg-red-600/10 border-red-600/30'
    }
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "500+", label: "Clientes Atendidos", color: "text-red-400" },
    { icon: <Star className="h-6 w-6" />, value: "98%", label: "Satisfação", color: "text-yellow-400" },
    { icon: <Award className="h-6 w-6" />, value: "10+", label: "Anos de Experiência", color: "text-blue-400" },
    { icon: <Shield className="h-6 w-6" />, value: "100%", label: "Garantia", color: "text-green-400" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/10 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="bg-gradient-to-br from-red-600 to-red-800 p-4 rounded-2xl shadow-2xl">
                <Settings className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent drop-shadow-2xl">
                OFICINA
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">GUAIANASES</span>
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-red-700 mx-auto mb-8"></div>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Calcule o valor dos seus serviços e gere notas fiscais profissionais com nossa 
              <span className="text-red-400 font-bold"> tecnologia avançada</span>
            </p>

            {/* User Info Badge */}
            {currentUser && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 inline-flex items-center space-x-3 bg-black/50 backdrop-blur-sm border border-red-600/50 rounded-full px-6 py-3"
              >
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Logado como: {currentUser.full_name}</span>
                <div className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                  {currentUser.type === 'mechanic' ? 'MECÂNICO' : 'ADMIN'}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Enhanced Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-black/30 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 text-center group hover:border-red-600/50 transition-all duration-300 hover:scale-105"
              >
                <div className={`${stat.color} mb-3 flex justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-white mb-2 group-hover:text-red-400 transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm font-medium group-hover:text-gray-300 transition-colors duration-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`${feature.bgColor} backdrop-blur-sm rounded-2xl p-8 border hover:border-red-600/50 transition-all duration-500 transform hover:scale-105 group relative overflow-hidden`}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="text-red-400 group-hover:text-red-300 transition-colors mb-6 transform group-hover:scale-110 duration-300 flex justify-center">
                    <div className="bg-black/50 p-4 rounded-xl">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 group-hover:text-red-400 transition-colors duration-300 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300 leading-relaxed text-center">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Service Calculator */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-black/30 backdrop-blur-sm rounded-3xl border border-gray-800/50 p-8 shadow-2xl"
          >
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-red-600 to-red-800 p-3 rounded-xl">
                  <Calculator className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white">Calculadora de Serviços</h2>
                  <p className="text-red-400 font-medium">Sistema Profissional de Orçamentos</p>
                </div>
              </div>
            </div>
            
            <ServiceCalculator />
          </motion.div>

          {/* Enhanced Professional Info */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-16 bg-gradient-to-r from-red-600/10 via-black/50 to-red-600/10 backdrop-blur-sm rounded-3xl border border-red-600/30 p-8"
          >
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Zap className="h-6 w-6 text-red-400" />
                <h3 className="text-2xl font-black text-white">Sistema Profissional</h3>
                <Zap className="h-6 w-6 text-red-400" />
              </div>
              <p className="text-gray-300 text-lg mb-6 max-w-3xl mx-auto">
                Nossa plataforma oferece cálculos precisos, geração automática de notas fiscais e 
                controle completo de todos os serviços realizados na oficina.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
                  <Clock className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <h4 className="text-white font-bold mb-2">Rapidez</h4>
                  <p className="text-gray-400 text-sm">Cálculos instantâneos e precisos</p>
                </div>
                <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
                  <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h4 className="text-white font-bold mb-2">Segurança</h4>
                  <p className="text-gray-400 text-sm">Dados protegidos e backup automático</p>
                </div>
                <div className="bg-black/50 rounded-xl p-6 border border-gray-800">
                  <Award className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                  <h4 className="text-white font-bold mb-2">Qualidade</h4>
                  <p className="text-gray-400 text-sm">Notas fiscais profissionais</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Workshop;
