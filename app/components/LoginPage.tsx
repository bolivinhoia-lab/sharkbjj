'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Users, ShieldCheck, ArrowRight, User, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage({ onLogin }: { onLogin: (userData: any) => void }) {
  const [role, setRole] = useState<'student' | 'instructor' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Usar mock API para login
    import('../mock-data').then(({ mockAPI }) => {
      const result = mockAPI.login(email, password);
      
      if (result.success) {
        onLogin(result.user);
      } else {
        alert(result.message);
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const roleCardVariants = {
    hover: { scale: 1.02, backgroundColor: "rgba(59, 130, 246, 0.1)" },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-shark-900 flex flex-col items-center justify-center p-4 selection:bg-primary-500 selection:text-white">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        className="w-full max-w-md relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-2xl shadow-lg shadow-primary-900/50 mb-4"
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <ShieldCheck className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">
            Shark<span className="text-primary-500">BJJ</span>
          </h1>
          <p className="text-shark-400 font-medium mt-2 italic">Domine o tatame, conquiste sua evolução.</p>
        </div>

        <AnimatePresence mode="wait">
          {!role ? (
            /* Role Selection */
            <motion.div 
              key="selection"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <h2 className="text-white text-xl font-bold text-center mb-6">Como você deseja acessar?</h2>
              
              <motion.button
                variants={roleCardVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setRole('student')}
                className="w-full p-6 bg-shark-800 border border-shark-700 rounded-2xl flex items-center gap-6 group transition-colors hover:border-primary-500/50"
              >
                <div className="w-14 h-14 bg-shark-700 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-lg leading-tight">Sou Aluno</h3>
                  <p className="text-shark-400 text-sm">Treinos, ranking e progresso</p>
                </div>
                <ArrowRight className="ml-auto w-5 h-5 text-shark-500 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </motion.button>

              <motion.button
                variants={roleCardVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setRole('instructor')}
                className="w-full p-6 bg-shark-800 border border-shark-700 rounded-2xl flex items-center gap-6 group transition-colors hover:border-primary-500/50"
              >
                <div className="w-14 h-14 bg-shark-700 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-bold text-lg leading-tight">Sou Instrutor</h3>
                  <p className="text-shark-400 text-sm">Gestão de aulas e alunos</p>
                </div>
                <ArrowRight className="ml-auto w-5 h-5 text-shark-500 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </motion.button>
            </motion.div>
          ) : (
            /* Login Form */
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="bg-shark-800 border border-shark-700 p-8 rounded-3xl shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-8">
                <button 
                  onClick={() => setRole(null)}
                  className="text-shark-500 hover:text-white transition-colors"
                >
                  Voltar
                </button>
                <div className="h-4 w-px bg-shark-700" />
                <span className="text-primary-500 font-bold uppercase tracking-wider text-sm">
                  {role === 'instructor' ? 'Portal do Instrutor' : 'Portal do Aluno'}
                </span>
              </div>

              <form className="space-y-5" onSubmit={handleLoginSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-shark-400 uppercase tracking-widest ml-1">E-mail</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-shark-500 group-focus-within:text-primary-500 transition-colors" />
                    <input 
                      type="email" 
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-shark-900 border border-shark-700 text-white pl-12 pr-4 py-4 rounded-xl outline-none focus:border-primary-500 transition-all placeholder:text-shark-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-shark-400 uppercase tracking-widest ml-1">Senha</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-shark-500 group-focus-within:text-primary-500 transition-colors" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-shark-900 border border-shark-700 text-white pl-12 pr-12 py-4 rounded-xl outline-none focus:border-primary-500 transition-all placeholder:text-shark-600"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-shark-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button type="button" className="text-shark-400 hover:text-primary-400 text-sm font-medium transition-colors ml-1">
                  Esqueceu sua senha?
                </button>

                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#2563eb' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-900/20 flex items-center justify-center gap-2 group mt-4"
                >
                  Entrar no Tatame
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>

              <p className="text-shark-500 text-center text-sm mt-8">
                Não tem uma conta? <button type="button" className="text-white font-bold hover:text-primary-400 underline underline-offset-4">Solicite seu acesso</button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="mt-12 text-center text-shark-600 text-xs">
          <p>© {new Date().getFullYear()} SharkBJJ Management System</p>
          <div className="flex justify-center gap-4 mt-2">
            <button type="button" className="hover:text-shark-400">Termos</button>
            <button type="button" className="hover:text-shark-400">Suporte</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
