'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import { 
  Trophy, 
  Flame, 
  Calendar, 
  TrendingUp, 
  Award, 
  Target, 
  ChevronRight,
  Star,
  Clock,
  Zap,
  ShieldCheck,
  Users,
  User,
  CheckCircle2,
  Lock,
  Play,
  LogOut,
  X,
  Info,
  QrCode
} from 'lucide-react';

export default function StudentDashboard({ user, onLogout }: { user: any, onLogout: () => void }) {
  // State for check-in with session persistence
  const [checkedIn, setCheckedIn] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [statDetail, setStatDetail] = useState<any>(null);
  const [beltProgress, setBeltProgress] = useState(75);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [studentData, setStudentData] = useState<any>(null);

  // Load check-in state from sessionStorage on mount
  useEffect(() => {
    const savedCheckIn = sessionStorage.getItem('studentCheckIn');
    const savedDate = sessionStorage.getItem('checkInDate');
    const today = new Date().toDateString();
    
    if (savedCheckIn === 'true' && savedDate === today) {
      setCheckedIn(true);
    } else {
      // Reset if it's a new day
      sessionStorage.removeItem('studentCheckIn');
      sessionStorage.removeItem('checkInDate');
      setCheckedIn(false);
    }
  }, []);

  // Carregar dados do estudante
  useEffect(() => {
    const loadStudentData = async () => {
      const { mockAPI } = await import('../../mock-data');
      const student = mockAPI.getStudentById(user?.id);
      if (student) {
        setStudentData(student);
        setBeltProgress((student.stripes / 4) * 100);
      }
    };
    
    if (user?.id) {
      loadStudentData();
    }
  }, [user?.id]);

  // Persist check-in state
  const handleCheckIn = () => {
    setCheckedIn(true);
    sessionStorage.setItem('studentCheckIn', 'true');
    sessionStorage.setItem('checkInDate', new Date().toDateString());
    
    // Simulate XP gain
    setTimeout(() => {
      setStatDetail({ type: 'xp', value: '+50 XP', message: 'Check-in bonus!' });
    }, 500);
  };

  const handleShowQR = async () => {
    try {
      const { mockAPI } = await import('../../mock-data');
      const qrData = mockAPI.generateStudentQRCode(user?.id || 'student_123');
      
      const url = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
      setShowQRModal(true);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };

  const stats = studentData ? [
    { label: 'Treinos', value: studentData.attendance.toString(), icon: Calendar, color: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/20', detail: `Total de ${studentData.attendance} treinos realizados` },
    { label: 'Streak', value: '5d', icon: Flame, color: 'from-orange-500 to-red-500', shadow: 'shadow-orange-500/20', detail: '5 dias consecutivos treinando!' },
    { label: 'XP', value: studentData.xp > 1000 ? `${(studentData.xp / 1000).toFixed(1)}k` : studentData.xp.toString(), icon: Zap, color: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-500/20', detail: `${studentData.xp} pontos de experiência totais` },
    { label: 'Level', value: studentData.level.toString(), icon: Trophy, color: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/20', detail: `Nível ${studentData.level} na academia` },
  ] : [
    { label: 'Treinos', value: '0', icon: Calendar, color: 'from-blue-500 to-cyan-400', shadow: 'shadow-blue-500/20', detail: 'Carregando dados...' },
    { label: 'Streak', value: '0d', icon: Flame, color: 'from-orange-500 to-red-500', shadow: 'shadow-orange-500/20', detail: 'Carregando dados...' },
    { label: 'XP', value: '0', icon: Zap, color: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-500/20', detail: 'Carregando dados...' },
    { label: 'Level', value: '0', icon: Trophy, color: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/20', detail: 'Carregando dados...' },
  ];

  const achievements = [
    { label: '7 Days Streak', icon: Flame, color: 'from-orange-500 to-red-500', unlocked: true, rarity: 'gold', description: 'Treine 7 dias consecutivos', date: '15 Jan 2024' },
    { label: 'Technical Flow', icon: Zap, color: 'from-blue-400 to-indigo-500', unlocked: true, rarity: 'silver', description: 'Complete 10 aulas de fluxo técnico', date: '10 Jan 2024' },
    { label: 'Early Bird', icon: Clock, color: 'from-emerald-400 to-teal-500', unlocked: true, rarity: 'bronze', description: 'Check-in antes das 7h da manhã', date: '05 Jan 2024' },
    { label: 'Mat Guardian', icon: ShieldCheck, color: 'from-slate-400 to-slate-500', unlocked: false, rarity: 'locked', description: 'Defenda a posição por 5 minutos seguidos', date: null },
  ];

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    sessionStorage.clear();
    onLogout();
  };

  const handleStatClick = (stat: any) => {
    setStatDetail(stat);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'rank':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 text-center">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white font-black text-2xl mb-2">Ranking da Academia</h3>
              <p className="text-slate-400">Você está no topo 15% dos alunos!</p>
              <div className="mt-6 space-y-3">
                {['#1 Carlos "Cobrinha"', '#2 Ana Paula', '#3 Marcos Dias', '...', '#12 Você'].map((item, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${item.includes('Você') ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-slate-900/30'}`}>
                    <span className="text-slate-300 font-bold">{item}</span>
                    <span className="text-slate-500 text-sm">{1500 - (i * 100)} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      case 'social':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
              <h3 className="text-white font-black text-xl mb-4">Comunidade</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">M</div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-bold">Marcos completou 100 treinos!</p>
                    <p className="text-slate-500 text-xs">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">A</div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-bold">Ana subiu para faixa roxa!</p>
                    <p className="text-slate-500 text-xs">Há 5 horas</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center text-3xl font-black text-white">
                {user?.name?.[0] || 'JS'}
              </div>
              <h3 className="text-white font-black text-xl">{user?.name || 'João Silva'}</h3>
              <p className="text-slate-400 text-sm mb-6">Membro desde 2023</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowLogoutConfirm(true)} className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 font-bold text-sm hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" /> Sair
                </button>
                <button className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 font-bold text-sm hover:bg-blue-500/20 transition-colors">
                  Editar Perfil
                </button>
              </div>
            </div>
          </motion.div>
        );
      default:
        return (
          <>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-3 relative z-10 mb-8">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  whileHover={{ y: -4, scale: 1.05, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStatClick(stat)}
                  className="relative group cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity blur-xl`} />
                  <div className="relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-4 rounded-2xl flex flex-col items-center gap-2 overflow-hidden">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} ${stat.shadow} shadow-lg`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-black text-xl leading-none">{stat.value}</span>
                    <span className="text-slate-500 text-[9px] uppercase font-bold tracking-wider">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Next Class Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Clock className="w-4 h-4 text-blue-400" /> Próximo Treino
              </h3>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 p-6 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.3),transparent_50%)]" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="text-white font-black text-2xl mb-1">BJJ Fundamentals</h4>
                        <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Professor Marcus "Tububarão"
                        </p>
                      </div>
                      <div className="bg-slate-950/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/50">
                        <span className="text-blue-400 font-black text-lg">19:00</span>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {!checkedIn ? (
                        <motion.button
                          key="checkin"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCheckIn}
                          onPointerDown={() => setIsPressed(true)}
                          onPointerUp={() => setIsPressed(false)}
                          className="relative w-full group overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-2xl" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          <motion.div 
                            animate={isPressed ? { scale: 0.95 } : { scale: 1 }}
                            className="relative px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-600/25 border border-white/10"
                          >
                            <span className="text-white font-black text-lg tracking-wide">Confirmar Check-in</span>
                            <motion.div
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ChevronRight className="w-5 h-5 text-white" />
                            </motion.div>
                          </motion.div>
                        </motion.button>
                      ) : (
                        <motion.div
                          key="checked"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="w-full py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:bg-emerald-500/20 transition-colors"
                          onClick={() => setStatDetail({ type: 'checked', message: 'Check-in realizado com sucesso!' })}
                        >
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          <span className="text-emerald-400 font-black text-lg">Check-in Confirmado!</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <ShieldCheck className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-blue-500/5 rotate-12" />
                </div>
              </div>
            </motion.section>

            {/* Belt Progress System */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Award className="w-4 h-4 text-blue-400" /> Progresso de Faixa
                </h3>
                <span className="text-blue-400 text-xs font-black bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">{beltProgress}%</span>
              </div>
              
              <div 
                className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl relative overflow-hidden cursor-pointer hover:border-slate-600/50 transition-colors"
                onClick={() => setBeltProgress(prev => prev < 100 ? prev + 5 : 0)}
              >
                <div className="mb-6 relative">
                  <div className="h-16 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-800 rounded-lg shadow-inner relative overflow-hidden border border-blue-400/20">
                    <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
                    
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-20 bg-gradient-to-b from-blue-700 to-blue-800 rounded shadow-lg border border-blue-500/30 flex items-center justify-center">
                      <div className="w-16 h-12 bg-blue-900/50 rounded border border-blue-400/20" />
                    </div>

                    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex gap-1.5">
                      {[1, 2, 3, 4].map((degree) => (
                        <motion.div 
                          key={degree}
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 0.6 + (degree * 0.1) }}
                          className={`w-2.5 h-10 rounded-sm origin-bottom ${degree <= 3 ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-slate-800/50 border border-slate-700/50'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400 font-medium">Faixa Azul - 3º Grau</span>
                    <span className="text-white font-bold">12 treinos restantes</span>
                  </div>
                  
                  <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden shadow-inner">
                    <div className="absolute inset-0 bg-slate-800/50" />
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${beltProgress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </motion.div>
                    <motion.div 
                      initial={{ left: 0 }}
                      animate={{ left: `${beltProgress}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-md -ml-2"
                    />
                  </div>
                  
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Iniciante</span>
                    <span className="text-blue-400">Avançado</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Achievements */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Target className="w-4 h-4 text-blue-400" /> Conquistas
                </h3>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className="text-blue-400 text-xs font-black hover:text-blue-300 transition-colors"
                >
                  Ver tudo
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((badge, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + (i * 0.1) }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAchievement(badge)}
                    className={`relative p-4 rounded-2xl border overflow-hidden cursor-pointer ${badge.unlocked ? 'bg-slate-800/40 border-slate-700/50' : 'bg-slate-900/30 border-slate-800/50'}`}
                  >
                    {badge.unlocked && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} opacity-5`} />
                    )}
                    
                    <div className="relative flex items-center gap-3">
                      <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center ${badge.unlocked ? `bg-gradient-to-br ${badge.color} shadow-lg` : 'bg-slate-800 border border-slate-700'}`}>
                        {badge.unlocked ? (
                          <badge.icon className="w-6 h-6 text-white drop-shadow-md" />
                        ) : (
                          <Lock className="w-5 h-5 text-slate-600" />
                        )}
                        
                        {badge.unlocked && (
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`text-xs font-black uppercase tracking-wider leading-tight ${badge.unlocked ? 'text-white' : 'text-slate-600'}`}>
                          {badge.label}
                        </h4>
                        <span className={`text-[10px] font-bold ${badge.unlocked ? 'text-slate-400' : 'text-slate-700'}`}>
                          {badge.unlocked ? 'Desbloqueado' : 'Bloqueado'}
                        </span>
                      </div>
                      
                      {badge.unlocked && badge.rarity === 'gold' && (
                        <motion.div 
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute -top-1 -right-1"
                        >
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-28 selection:bg-blue-500/30">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Header / Profile Summary */}
      <header className="relative pt-14 pb-10 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-18 h-18 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-lg shadow-blue-500/25">
                <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center text-2xl font-black text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
                  {user?.name?.[0] || 'JS'}
                </div>
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl border-2 border-slate-900 flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <Star className="w-4 h-4 text-white fill-current" />
              </motion.div>
            </motion.div>
            <div>
              <motion.h2 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-white font-bold text-2xl tracking-tight"
              >
                {user?.name || 'João Silva'}
              </motion.h2>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mt-1"
              >
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-wider">
                  Faixa Azul
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-slate-400 text-xs font-medium">Online</span>
              </motion.div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShowQR}
              className="p-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Meu QR Code"
            >
              <QrCode className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-8 relative z-10">
        {renderContent()}
      </main>

      {/* Navigation Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 bg-slate-950/80 backdrop-blur-2xl border-t border-slate-800/50 flex items-center justify-around px-6 z-50 pb-4">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('home')}
          className={`p-3 flex flex-col items-center gap-1.5 relative ${activeTab === 'home' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {activeTab === 'home' && <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-md" />}
          <Calendar className="w-6 h-6 relative z-10" />
          <span className="text-[10px] font-black uppercase relative z-10">Treinos</span>
        </motion.button>
        
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('rank')}
          className={`p-3 flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'rank' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Trophy className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase">Rank</span>
        </motion.button>

        <div className="relative -top-4">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('home')}
            className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center text-white border border-white/10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20" />
            <Play className="w-7 h-7 fill-current relative z-10 ml-1" />
          </motion.button>
        </div>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('social')}
          className={`p-3 flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'social' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase">Social</span>
        </motion.button>
        
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('profile')}
          className={`p-3 flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'profile' ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase">Perfil</span>
        </motion.button>
      </nav>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80] flex items-center justify-center p-6"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-white font-black text-xl">Meu QR Code</h3>
                <button onClick={() => setShowQRModal(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <p className="text-slate-400 text-sm mb-6">Apresente este QR Code para o instrutor registrar sua presença.</p>
              <div className="bg-white p-4 rounded-2xl inline-block mb-4">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                ) : (
                  <div className="w-48 h-48 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-slate-400" />
                  </div>
                )}
              </div>
              <p className="text-slate-500 text-xs">ID: {user?.id || 'student_123'}</p>
              <p className="text-slate-600 text-[10px] mt-1">Gerado em: {new Date().toLocaleTimeString()}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-6"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedAchievement.color} flex items-center justify-center shadow-lg`}>
                  <selectedAchievement.icon className="w-8 h-8 text-white" />
                </div>
                <button onClick={() => setSelectedAchievement(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <h3 className="text-white font-black text-xl mb-2">{selectedAchievement.label}</h3>
              <p className="text-slate-400 text-sm mb-4">{selectedAchievement.description}</p>
              {selectedAchievement.unlocked ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Desbloqueado em {selectedAchievement.date}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 text-sm font-bold">
                  <Lock className="w-4 h-4" />
                  Complete o desafio para desbloquear
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stat Detail Toast */}
      <AnimatePresence>
        {statDetail && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-28 left-6 right-6 bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-2xl z-[60] flex items-center gap-3"
          >
            <div className="p-2 bg-blue-500/20 rounded-full">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">{statDetail.value || statDetail.message}</p>
              <p className="text-slate-400 text-xs">{statDetail.detail || statDetail.message}</p>
            </div>
            <button onClick={() => setStatDetail(null)} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-6"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-white font-black text-xl mb-2">Sair da conta?</h3>
              <p className="text-slate-400 text-sm mb-6">Você precisará fazer login novamente para acessar seus dados.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 bg-slate-800 rounded-xl text-white font-bold hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmLogout}
                  className="flex-1 py-3 bg-red-500 rounded-xl text-white font-bold hover:bg-red-600 transition-colors"
                >
                  Sair
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}