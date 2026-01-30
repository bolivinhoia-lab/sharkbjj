'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Zap, 
  Star, 
  Target, 
  Lock, 
  ChevronRight,
  ShieldCheck,
  Medal,
  Award
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  icon: any;
  unlocked: boolean;
  progress: number;
  category: 'combat' | 'streak' | 'technical' | 'special';
}

export default function AchievementSystem() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const achievements: Achievement[] = [
    { id: '1', title: 'Primeira Mordida', description: 'Complete seu primeiro treino na academia.', xp: 100, icon: ShieldCheck, unlocked: true, progress: 100, category: 'special' },
    { id: '2', title: 'Predador Alpha', description: 'Mantenha um streak de 7 dias consecutivos.', xp: 500, icon: Flame, unlocked: false, progress: 60, category: 'streak' },
    { id: '3', title: 'Técnica Afiada', description: 'Execute 50 finalizações em sparring.', xp: 300, icon: Zap, unlocked: false, progress: 30, category: 'technical' },
    { id: '4', title: 'Casca Grossa', description: 'Treine sob chuva ou feriados.', xp: 400, icon: Trophy, unlocked: true, progress: 100, category: 'combat' },
    { id: '5', title: 'Mestre da Guarda', description: 'Defenda 10 passagens de guarda.', xp: 250, icon: Target, unlocked: false, progress: 80, category: 'technical' },
    { id: '6', title: 'Lenda do Tatame', description: 'Alcance 100 treinos totais.', xp: 1000, icon: Medal, unlocked: false, progress: 42, category: 'combat' },
  ];

  const filtered = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  return (
    <div className="p-6 bg-shark-950 min-h-screen pb-20">
      {/* Gamification Stats Header */}
      <div className="mb-10 flex items-center justify-between gap-4 overflow-x-auto pb-4 scrollbar-hide">
         <StatItem label="Nível 12" value="750 / 1000 XP" progress={75} icon={Star} color="text-yellow-400" />
         <StatItem label="Rank Global" value="#42" progress={100} icon={Trophy} color="text-primary-500" />
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-white uppercase italic">Conquistas</h2>
        <div className="flex gap-2">
           <CategoryFilter active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')} label="Tudo" />
           <CategoryFilter active={selectedCategory === 'streak'} onClick={() => setSelectedCategory('streak')} label="Streak" />
           <CategoryFilter active={selectedCategory === 'technical'} onClick={() => setSelectedCategory('technical')} label="Técnica" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((achievement) => (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`relative p-6 rounded-[2rem] border-2 transition-all overflow-hidden group ${
                achievement.unlocked 
                ? 'bg-shark-900 border-primary-500/30' 
                : 'bg-shark-900/40 border-shark-800'
              }`}
            >
              {/* Achievement Background Pattern */}
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform duration-500">
                 <achievement.icon className="w-24 h-24" />
              </div>

              <div className="flex items-start gap-5 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  achievement.unlocked 
                  ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white' 
                  : 'bg-shark-800 text-shark-600'
                }`}>
                  {achievement.unlocked ? <achievement.icon className="w-7 h-7" /> : <Lock className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-black uppercase text-sm tracking-tight ${achievement.unlocked ? 'text-white' : 'text-shark-500'}`}>
                      {achievement.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      achievement.unlocked ? 'bg-primary-500/20 text-primary-400' : 'bg-shark-800 text-shark-600'
                    }`}>
                      +{achievement.xp} XP
                    </span>
                  </div>
                  <p className="text-shark-400 text-xs leading-relaxed mb-4">
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-tighter text-shark-500">
                      <span>Progresso</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-shark-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${achievement.unlocked ? 'bg-primary-500' : 'bg-shark-600'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {!achievement.unlocked && (
                <div className="mt-4 flex justify-end">
                   <button className="text-[10px] font-black uppercase text-primary-500 flex items-center gap-1 hover:gap-2 transition-all">
                      Como desbloquear <ChevronRight className="w-3 h-3" />
                   </button>
                </div>
              )}

              {achievement.unlocked && (
                <div className="absolute top-2 right-2">
                   <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40"
                   >
                     <ShieldCheck className="w-3 h-3 text-white" />
                   </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatItem({ label, value, progress, icon: Icon, color }: any) {
  return (
    <div className="min-w-[240px] bg-shark-900 p-5 rounded-3xl border border-shark-800 shrink-0">
      <div className="flex items-center gap-4 mb-3">
        <div className={`p-2 rounded-xl bg-shark-800 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-shark-500 text-[10px] font-black uppercase tracking-widest">{label}</p>
          <p className="text-white font-bold">{value}</p>
        </div>
      </div>
      <div className="w-full h-1.5 bg-shark-800 rounded-full overflow-hidden">
        <div className={`h-full bg-primary-500`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function CategoryFilter({ active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
        active 
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/30' 
        : 'bg-shark-800 text-shark-500 hover:text-shark-300'
      }`}
    >
      {label}
    </button>
  );
}
