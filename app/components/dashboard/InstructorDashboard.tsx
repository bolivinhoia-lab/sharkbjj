'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  CalendarCheck, 
  UserPlus, 
  Search, 
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  LogOut,
  ChevronRight,
  Bell,
  Activity,
  QrCode,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { Html5QrcodeScanner } from "html5-qrcode";
import StudentManagement from '../instructor/StudentManagement';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const cardHoverVariants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const buttonTapVariants = {
  tap: { scale: 0.97 }
};

const sidebarItemVariants = {
  rest: { x: 0 },
  hover: { x: 4, transition: { duration: 0.2 } }
};

interface QRScannerModalProps {
  onClose: () => void;
  onScanSuccess: (decodedText: string) => void;
}

function QRScannerModal({ onClose, onScanSuccess }: QRScannerModalProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
      },
      false
    );
    
    scannerRef.current.render(
      (decodedText) => {
        setScanResult(decodedText);
        onScanSuccess(decodedText);
        setTimeout(() => {
          scannerRef.current?.clear();
          onClose();
        }, 1500);
      },
      (errorMessage) => {
        // Silently ignore scan errors (no QR found in frame)
        if (!errorMessage.includes('No QR code found')) {
          console.error(errorMessage);
          setError('Erro ao acessar câmera. Verifique as permissões.');
        }
      }
    );
    
    return () => {
      scannerRef.current?.clear().catch(console.error);
    };
  }, [onScanSuccess, onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full relative shadow-2xl shadow-cyan-900/20"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition-colors z-10"
        >
          <span className="text-2xl leading-none">×</span>
        </button>
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-cyan-500/20">
            <QrCode className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-black text-white mb-2">Ler QR Code</h3>
          <p className="text-slate-400 text-sm">Posicione o QR Code do aluno dentro da área de leitura</p>
        </div>
        
        <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800">
          <div id="qr-reader" className="w-full" />
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center"
          >
            <p className="text-red-400 font-bold text-sm">{error}</p>
          </motion.div>
        )}
        
        {scanResult && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center"
          >
            <p className="text-emerald-400 font-bold text-sm">QR Code lido com sucesso!</p>
            <p className="text-emerald-300/80 text-xs mt-1 truncate">{scanResult}</p>
          </motion.div>
        )}
        
        <div className="mt-6 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-colors border border-slate-700"
          >
            Cancelar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function InstructorDashboard({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [lastScan, setLastScan] = useState<{name: string, time: string} | null>(null);
  
  const [students, setStudents] = useState<any[]>([]);
  
  // Carregar estudantes do mock API
  useEffect(() => {
    const { mockAPI } = require('../../mock-data');
    const mockStudents = mockAPI.getStudents().map((student: any) => ({
      name: student.name,
      rank: `Faixa ${student.belt === 'white' ? 'Branca' : student.belt === 'blue' ? 'Azul' : student.belt === 'purple' ? 'Roxa' : student.belt === 'brown' ? 'Marrom' : 'Preta'}`,
      status: student.lastAttendance === new Date().toISOString().split('T')[0] ? 'Presente' : 'Ausente',
      attendance: `${Math.round((student.attendance / 50) * 100)}%`,
      lastSeen: student.lastAttendance ? new Date(student.lastAttendance).toLocaleDateString() : 'Nunca',
      beltColor: student.belt === 'white' ? 'bg-slate-200' : 
                 student.belt === 'blue' ? 'bg-blue-500' :
                 student.belt === 'purple' ? 'bg-purple-500' :
                 student.belt === 'brown' ? 'bg-amber-700' : 'bg-black',
      id: student.id
    }));
    setStudents(mockStudents);
  }, []);

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', id: 'Dashboard' },
    { icon: Users, label: 'Alunos', id: 'Alunos' },
    { icon: CalendarCheck, label: 'Frequência', id: 'Frequencia' },
    { icon: Award, label: 'Graduações', id: 'Graduacoes' },
    { icon: Calendar, label: 'Cronograma', id: 'Cronograma' },
    { icon: Bell, label: 'Mensagens', id: 'Mensagens' },
    { icon: Activity, label: 'Relatórios', id: 'Relatorios' }
  ];

  // Filter students based on search query
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.includes(searchQuery)
  );

  // Handle navigation tab click
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    console.log(`Navigating to: ${tabId}`);
  };

  // Handle new student button
  const handleNewStudent = () => {
    console.log('Opening new student registration modal...');
    alert('Modal: Cadastrar Novo Aluno');
  };

  // Handle schedule button
  const handleSchedule = () => {
    console.log('Opening schedule view...');
    alert('Abrindo Cronograma de Aulas');
  };

  // Handle notifications
  const handleNotifications = () => {
    console.log('Opening notifications panel...');
    alert('Você tem 3 notificações não lidas');
  };

  // Handle filter button
  const handleFilter = () => {
    console.log('Opening filter options...');
    alert('Filtros: Graduação, Status, Período');
  };

  // Handle student menu (three dots)
  const handleStudentMenu = (studentName: string) => {
    console.log(`Opening menu for student: ${studentName}`);
    alert(`Opções para ${studentName}: Editar, Histórico, Excluir`);
  };

  // Handle QR Scan Success
  const handleScanSuccess = (decodedText: string) => {
    console.log(`QR Code scanned: ${decodedText}`);
    
    const { mockAPI } = require('../../mock-data');
    const result = mockAPI.scanQRCode(decodedText, user?.id || 'instructor1');
    
    if (result.success && result.student) {
      setLastScan({ name: result.student.name, time: new Date().toLocaleTimeString() });
      alert(`${result.message}\nHorário: ${new Date().toLocaleTimeString()}`);
      
      // Recarregar lista de estudantes
      const updatedStudents = mockAPI.getStudents().map((student: any) => ({
        name: student.name,
        rank: `Faixa ${student.belt === 'white' ? 'Branca' : student.belt === 'blue' ? 'Azul' : student.belt === 'purple' ? 'Roxa' : student.belt === 'brown' ? 'Marrom' : 'Preta'}`,
        status: student.lastAttendance === new Date().toISOString().split('T')[0] ? 'Presente' : 'Ausente',
        attendance: `${Math.round((student.attendance / 50) * 100)}%`,
        lastSeen: student.lastAttendance ? new Date(student.lastAttendance).toLocaleDateString() : 'Nunca',
        beltColor: student.belt === 'white' ? 'bg-slate-200' : 
                   student.belt === 'blue' ? 'bg-blue-500' :
                   student.belt === 'purple' ? 'bg-purple-500' :
                   student.belt === 'brown' ? 'bg-amber-700' : 'bg-black',
        id: student.id
      }));
      setStudents(updatedStudents);
    } else {
      alert(result.message);
    }
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      console.log(`Going to page ${currentPage - 1}`);
    } else {
      console.log('Already on first page');
    }
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
    console.log(`Going to page ${currentPage + 1}`);
  };

  // Handle logout with confirmation
  const handleLogout = () => {
    if (typeof window !== 'undefined' && window.confirm('Deseja realmente sair da conta?')) {
      console.log('Logging out...');
      onLogout();
    }
  };

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'Alunos':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            <StudentManagement />
          </motion.div>
        );
      case 'Frequencia':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-slate-400"
          >
            <CalendarCheck className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-slate-300 mb-2">Controle de Frequência</h3>
            <p>Visualização detalhada de presenças em breve</p>
          </motion.div>
        );
      case 'Graduacoes':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Sistema de Graduações</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Pendentes de Graduação
                </h3>
                <div className="space-y-3">
                  {students.slice(0, 3).map(student => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{student.name}</p>
                        <p className="text-slate-400 text-sm">Faixa {student.belt} - {student.stripes} fitas</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors">
                          + Fita
                        </button>
                        <button className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors">
                          + Faixa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-white font-bold mb-4">Critérios de Graduação</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-cyan-400 font-medium">Faixa Branca → Azul:</p>
                    <p className="text-slate-400">• Mínimo 12 meses treinando</p>
                    <p className="text-slate-400">• 80+ aulas frequentadas</p>
                    <p className="text-slate-400">• Domínio dos fundamentos</p>
                  </div>
                  <div>
                    <p className="text-cyan-400 font-medium">Faixa Azul → Roxa:</p>
                    <p className="text-slate-400">• Mínimo 24 meses como azul</p>
                    <p className="text-slate-400">• 120+ aulas frequentadas</p>
                    <p className="text-slate-400">• Capacidade de ensinar básicos</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'Mensagens':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Central de Mensagens</h2>
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Nova Mensagem
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-slate-800 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-bold mb-4">Conversas Recentes</h3>
                <div className="space-y-2">
                  {students.slice(0, 5).map(student => (
                    <div key={student.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer transition-colors">
                      <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-bold">
                        {student.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{student.name}</p>
                        <p className="text-slate-400 text-xs">Última mensagem...</p>
                      </div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-xl p-4">
                <h3 className="text-white font-bold mb-4">Enviar Aviso Geral</h3>
                <div className="space-y-4">
                  <textarea 
                    placeholder="Digite seu aviso para todos os alunos..."
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg focus:border-cyan-500 outline-none resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4 text-sm text-slate-400">
                      <span>📢 Aviso geral</span>
                      <span>🏆 Competição</span>
                      <span>📅 Cronograma</span>
                    </div>
                    <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg">
                      Enviar Aviso
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-white font-semibold mb-3">Mensagens Recentes</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    <div className="p-3 bg-slate-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-cyan-400 font-medium text-sm">Para: Todos os alunos</span>
                        <span className="text-slate-400 text-xs">há 2 horas</span>
                      </div>
                      <p className="text-white text-sm">Lembrete: Competição Copacabana Open em 15 de fevereiro. Inscrições abertas!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'Cronograma':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Cronograma de Aulas</h2>
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Nova Aula
              </button>
            </div>
            
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="grid grid-cols-7 gap-4 mb-6">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="text-center">
                    <h3 className="text-white font-bold text-sm mb-4">{day}</h3>
                    <div className="space-y-2">
                      {day === 'Seg' && (
                        <>
                          <div className="p-2 bg-cyan-600 rounded text-white text-xs">
                            <p className="font-medium">19:00-20:30</p>
                            <p>Fundamentals</p>
                          </div>
                          <div className="p-2 bg-purple-600 rounded text-white text-xs">
                            <p className="font-medium">20:30-22:00</p>
                            <p>Advanced</p>
                          </div>
                        </>
                      )}
                      {day === 'Qua' && (
                        <div className="p-2 bg-orange-600 rounded text-white text-xs">
                          <p className="font-medium">19:00-20:30</p>
                          <p>No-Gi</p>
                        </div>
                      )}
                      {day === 'Sex' && (
                        <div className="p-2 bg-green-600 rounded text-white text-xs">
                          <p className="font-medium">19:00-21:00</p>
                          <p>Open Mat</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-slate-700 pt-4">
                <h4 className="text-white font-semibold mb-3">Próximas Aulas Hoje</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Fundamentals - 19:00</p>
                      <p className="text-slate-400 text-sm">Prof. Carlos • Gi • Iniciantes</p>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-medium">12 inscritos</p>
                      <p className="text-slate-400 text-sm">Máx: 20</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 'Relatorios':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Relatórios e Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-slate-400 text-sm mb-2">Total de Alunos</h3>
                <p className="text-3xl font-bold text-white">{students.length}</p>
                <p className="text-emerald-400 text-sm mt-1">↗ +2 este mês</p>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-slate-400 text-sm mb-2">Receita Mensal</h3>
                <p className="text-3xl font-bold text-white">R$ 12.450</p>
                <p className="text-emerald-400 text-sm mt-1">↗ +5.2% vs mês anterior</p>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-slate-400 text-sm mb-2">Taxa de Presença</h3>
                <p className="text-3xl font-bold text-white">78%</p>
                <p className="text-yellow-400 text-sm mt-1">→ Estável</p>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="text-slate-400 text-sm mb-2">Pagamentos Pendentes</h3>
                <p className="text-3xl font-bold text-white">3</p>
                <p className="text-red-400 text-sm mt-1">R$ 450 total</p>
              </div>
            </div>
            
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-white font-bold mb-4">Distribuição por Faixas</h3>
              <div className="grid grid-cols-5 gap-4">
                {[
                  { belt: 'white', count: students.filter(s => s.belt === 'white').length, color: 'bg-slate-200' },
                  { belt: 'blue', count: students.filter(s => s.belt === 'blue').length, color: 'bg-blue-500' },
                  { belt: 'purple', count: students.filter(s => s.belt === 'purple').length, color: 'bg-purple-500' },
                  { belt: 'brown', count: students.filter(s => s.belt === 'brown').length, color: 'bg-amber-700' },
                  { belt: 'black', count: students.filter(s => s.belt === 'black').length, color: 'bg-slate-900' }
                ].map(({ belt, count, color }) => (
                  <div key={belt} className="text-center">
                    <div className={`w-12 h-12 ${color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
                      <span className="text-white font-bold">{count}</span>
                    </div>
                    <p className="text-slate-400 text-sm capitalize">{belt}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex selection:bg-cyan-500/30">
      {/* Enhanced Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex w-72 flex-col bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 p-6 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-12 px-2 relative z-10">
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/20"
          >
            <Award className="w-7 h-7 text-white" strokeWidth={2.5} />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight leading-none">
              Shark<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">BJJ</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1">Academy Pro</span>
          </div>
        </div>

        <nav className="space-y-1 flex-1 relative z-10">
          {navItems.map((item) => (
            <NavItem 
              key={item.id}
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.id}
              onClick={() => handleTabClick(item.id)}
            />
          ))}
        </nav>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/30 p-5 rounded-3xl border border-slate-700/50 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                {user?.name?.[0] || 'M'}
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-800 rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{user?.name || 'Mestre Marcus'}</p>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Admin Academy</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-all rounded-xl flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600"
          >
            <LogOut className="w-3.5 h-3.5" /> Sair da Conta
          </motion.button>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 max-h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
                {activeTab === 'Dashboard' ? 'Painel do' : activeTab} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                {activeTab === 'Dashboard' ? 'Instrutor' : ''}
              </span>
              </h2>
              <p className="text-slate-400 text-sm font-medium">
                {activeTab === 'Dashboard' 
                  ? 'Gerencie seus alunos e acompanhe o crescimento da academia em tempo real.'
                  : `Visualizando seção: ${activeTab}`
                }
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNotifications}
                className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white hover:border-slate-700 transition-all relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              </motion.button>
              
              <div className="flex gap-3 flex-wrap">
                <motion.button 
                  variants={buttonTapVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap="tap"
                  onClick={handleSchedule}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-6 py-3.5 rounded-2xl font-bold transition-all border border-slate-800 hover:border-slate-700 shadow-lg shadow-black/20"
                >
                  <CalendarCheck className="w-5 h-5" />
                  <span>Cronograma</span>
                </motion.button>

                <motion.button 
                  variants={buttonTapVariants}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(6,182,212,0.3)" }}
                  whileTap="tap"
                  onClick={() => setIsScannerOpen(true)}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3.5 rounded-2xl font-bold transition-all border border-slate-700 hover:border-cyan-500/30 shadow-lg shadow-black/20"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Ler QR Code</span>
                </motion.button>
                
                <motion.button 
                  variants={buttonTapVariants}
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(6,182,212,0.3)" }}
                  whileTap="tap"
                  onClick={handleNewStudent}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-cyan-900/20 border border-cyan-500/20"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Novo Aluno</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Last Scan Notification */}
          <AnimatePresence>
            {lastScan && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-emerald-400 font-bold text-sm">Presença Registrada</p>
                    <p className="text-emerald-300/80 text-xs">{lastScan.name} às {lastScan.time}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setLastScan(null)}
                  className="text-emerald-400/60 hover:text-emerald-400"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conditional Content based on Active Tab */}
          {activeTab !== 'Dashboard' && renderContent()}

          {activeTab === 'Dashboard' && (
            <>
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard label="Total de Alunos" value="128" trend="+12%" icon={Users} color="from-blue-500 to-cyan-500" delay={0} onClick={() => handleTabClick('Alunos')} />
                <StatCard label="Média de Frequência" value="86%" trend="+5%" icon={CalendarCheck} color="from-emerald-500 to-teal-500" delay={0.1} onClick={() => handleTabClick('Frequencia')} />
                <StatCard label="Graduações Pendentes" value="14" trend="Urgente" icon={Award} color="from-violet-500 to-purple-500" delay={0.2} onClick={() => handleTabClick('Graduacoes')} />
                <StatCard label="Novos Leads" value="23" trend="+18%" icon={TrendingUp} color="from-orange-500 to-amber-500" delay={0.3} onClick={() => console.log('Abrir leads')} />
              </div>

              {/* Students Table Section */}
              <motion.section 
                variants={itemVariants}
                className="bg-slate-900/30 backdrop-blur-sm rounded-[2rem] border border-slate-800/50 overflow-hidden shadow-2xl shadow-black/20"
              >
                <div className="p-8 border-b border-slate-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-slate-900/50 to-transparent">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl tracking-tight">Monitoramento em Tempo Real</h3>
                      <p className="text-slate-500 text-xs font-medium mt-0.5">Atualizado há 2 minutos</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar aluno..." 
                        className="bg-slate-950/50 border border-slate-800 text-white pl-11 pr-4 py-3 rounded-xl text-sm focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all w-full lg:w-72 placeholder:text-slate-600"
                      />
                      {searchQuery && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                        >
                          ×
                        </motion.button>
                      )}
                    </motion.div>
                    <motion.button 
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleFilter}
                      className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white border border-slate-700/50 transition-all"
                    >
                      <Filter className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-950/30 border-b border-slate-800/50">
                        <th className="px-8 py-5 text-slate-500 text-[11px] uppercase font-black tracking-[0.15em]">Aluno</th>
                        <th className="px-8 py-5 text-slate-500 text-[11px] uppercase font-black tracking-[0.15em]">Graduação</th>
                        <th className="px-8 py-5 text-slate-500 text-[11px] uppercase font-black tracking-[0.15em]">Status Aula</th>
                        <th className="px-8 py-5 text-slate-500 text-[11px] uppercase font-black tracking-[0.15em]">Assiduidade</th>
                        <th className="px-8 py-5 text-slate-500 text-[11px] uppercase font-black tracking-[0.15em]">Última Atividade</th>
                        <th className="px-8 py-5"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      <AnimatePresence mode='wait'>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student, i) => (
                            <motion.tr 
                              key={student.name + i} 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: Math.min(i * 0.05, 0.5) }}
                              whileHover={{ backgroundColor: "rgba(30, 41, 59, 0.4)" }}
                              className="group transition-colors cursor-pointer"
                            >
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="w-11 h-11 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold text-xs border border-slate-700 group-hover:border-cyan-500/30 transition-colors relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {student.name.split(' ').map((n: string) => n[0]).join('')}
                                  </div>
                                  <div>
                                    <span className="text-white font-bold text-sm block group-hover:text-cyan-400 transition-colors">{student.name}</span>
                                    <span className="text-slate-600 text-[10px] font-medium">ID: #{student.id}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${student.beltColor} ring-2 ring-slate-800`} />
                                  <span className="text-slate-300 text-xs font-semibold px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                                    {student.rank}
                                  </span>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-2.5">
                                  {student.status === 'Presente' ? (
                                    <>
                                      <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                      </span>
                                      <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                        Presente
                                      </span>
                                    </>
                                  ) : student.status === 'Atrasada' ? (
                                    <>
                                      <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                                      <span className="text-amber-400 text-xs font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                                        Atrasada
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                                      <span className="text-slate-400 text-xs font-bold bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
                                        Faltou
                                      </span>
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      animate={{ width: student.attendance }}
                                      transition={{ duration: 1, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                                      className={`h-full rounded-full ${parseInt(student.attendance) > 90 ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'}`} 
                                    />
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-bold tabular-nums">{student.attendance}</span>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <span className="text-slate-400 text-xs font-medium flex items-center gap-2">
                                  <Clock className="w-3.5 h-3.5 text-slate-600" />
                                  {student.lastSeen}
                                </span>
                              </td>
                              <td className="px-8 py-5 text-right">
                                <motion.button 
                                  whileHover={{ scale: 1.1, rotate: 90 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleStudentMenu(student.name)}
                                  className="text-slate-600 hover:text-cyan-400 transition-colors p-2 hover:bg-slate-800 rounded-lg"
                                >
                                  <MoreVertical className="w-5 h-5" />
                                </motion.button>
                              </td>
                            </motion.tr>
                          ))
                        ) : (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <td colSpan={6} className="px-8 py-12 text-center text-slate-500">
                              <div className="flex flex-col items-center gap-3">
                                <Search className="w-8 h-8 opacity-20" />
                                <p className="text-sm">Nenhum aluno encontrado para "{searchQuery}"</p>
                                <button 
                                  onClick={() => setSearchQuery('')}
                                  className="text-cyan-400 hover:text-cyan-300 text-xs font-bold underline"
                                >
                                  Limpar busca
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                
                <div className="p-6 border-t border-slate-800/50 bg-slate-950/20 flex items-center justify-between">
                  <p className="text-slate-600 text-xs font-medium">
                    Mostrando {filteredStudents.length} de {students.length} alunos
                    {searchQuery && ` (filtrado)`}
                  </p>
                  <div className="flex gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNextPage}
                      className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700/50 flex items-center gap-2"
                    >
                      Próximo
                      <ChevronRight className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
              </motion.section>
            </>
          )}
        </motion.div>
      </main>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {isScannerOpen && (
          <QRScannerModal 
            onClose={() => setIsScannerOpen(false)}
            onScanSuccess={handleScanSuccess}
          />
        )}
      </AnimatePresence>

      {/* Mobile Logout */}
      <motion.button 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleLogout}
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-2xl shadow-2xl shadow-cyan-900/40 flex items-center justify-center border border-cyan-400/20 z-50"
      >
        <LogOut className="w-6 h-6" />
      </motion.button>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <motion.button 
      variants={sidebarItemVariants}
      initial="rest"
      whileHover="hover"
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all relative group ${
        active 
          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
          : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
      }`}
    >
      <div className={`p-2 rounded-xl transition-all ${active ? 'bg-cyan-500/20' : 'bg-slate-800/50 group-hover:bg-slate-800'}`}>
        <Icon className={`w-5 h-5 ${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
      </div>
      <span className="tracking-wide">{label}</span>
      {active && (
        <motion.div 
          layoutId="activeIndicator"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
        />
      )}
    </motion.button>
  );
}

function StatCard({ label, value, trend, icon: Icon, color, delay, onClick }: any) {
  const isPositive = trend.startsWith('+');
  
  return (
    <motion.div 
      variants={itemVariants}
      initial="rest"
      whileHover="hover"
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      <motion.div 
        variants={cardHoverVariants}
        className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-[2rem] border border-slate-800/50 relative overflow-hidden h-full"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <motion.div 
            whileHover={{ rotate: -10, scale: 1.1 }}
            className={`p-3.5 rounded-2xl bg-gradient-to-br ${color} shadow-lg shadow-black/20`}
          >
            <Icon className="w-6 h-6 text-white" strokeWidth={2.5} />
          </motion.div>
          <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
            isPositive 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : trend === 'Urgente' 
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {trend}
          </div>
        </div>
        
        <div className="relative z-10">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.15em] mb-2">{label}</p>
          <div className="flex items-baseline gap-1">
            <h4 className="text-3xl font-black text-white tracking-tight">{value}</h4>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent group-hover:via-cyan-500/20 transition-colors" />
      </motion.div>
    </motion.div>
  );
}