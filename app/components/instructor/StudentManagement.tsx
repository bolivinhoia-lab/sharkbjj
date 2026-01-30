'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Award,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Trophy,
  AlertTriangle,
  Edit,
  Trash2,
  Crown
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  belt: 'white' | 'blue' | 'purple' | 'brown' | 'black';
  stripes: number;
  attendance: number;
  xp: number;
  joinDate: string;
  paymentStatus: 'current' | 'overdue' | 'suspended';
  competitionsParticipated: number;
  phone?: string;
  notes: string;
  achievements: string[];
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBelt, setFilterBelt] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const { mockAPI } = require('../../mock-data');
    setStudents(mockAPI.getStudents());
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBelt = filterBelt === 'all' || student.belt === filterBelt;
    const matchesPayment = filterPayment === 'all' || student.paymentStatus === filterPayment;
    
    return matchesSearch && matchesBelt && matchesPayment;
  });

  const getBeltColor = (belt: string) => {
    const colors = {
      white: 'bg-slate-200 text-slate-900',
      blue: 'bg-blue-500 text-white',
      purple: 'bg-purple-500 text-white', 
      brown: 'bg-amber-700 text-white',
      black: 'bg-slate-900 text-white'
    };
    return colors[belt as keyof typeof colors] || colors.white;
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      current: 'bg-emerald-100 text-emerald-800',
      overdue: 'bg-red-100 text-red-800',
      suspended: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.current;
  };

  const handlePromoteStudent = async (studentId: string, action: 'stripe' | 'belt') => {
    const { mockAPI } = require('../../mock-data');
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (action === 'stripe' && student.stripes < 4) {
      await mockAPI.promoteStudent(studentId, undefined, student.stripes + 1);
    } else if (action === 'belt') {
      const belts = ['white', 'blue', 'purple', 'brown', 'black'];
      const currentIndex = belts.indexOf(student.belt);
      if (currentIndex < belts.length - 1) {
        await mockAPI.promoteStudent(studentId, belts[currentIndex + 1]);
      }
    }
    
    // Reload students
    setStudents(mockAPI.getStudents());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestão de Alunos</h2>
          <p className="text-slate-400">{students.length} alunos registrados</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddStudent(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <UserPlus className="w-4 h-4" />
          Novo Aluno
        </motion.button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar alunos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:border-cyan-500 outline-none"
          />
        </div>

        <select
          value={filterBelt}
          onChange={(e) => setFilterBelt(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg focus:border-cyan-500 outline-none"
        >
          <option value="all">Todas as Faixas</option>
          <option value="white">Branca</option>
          <option value="blue">Azul</option>
          <option value="purple">Roxa</option>
          <option value="brown">Marrom</option>
          <option value="black">Preta</option>
        </select>

        <select
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
          className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg focus:border-cyan-500 outline-none"
        >
          <option value="all">Status de Pagamento</option>
          <option value="current">Em dia</option>
          <option value="overdue">Atrasado</option>
          <option value="suspended">Suspenso</option>
        </select>

        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Filter className="w-4 h-4" />
          {filteredStudents.length} resultados
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map((student) => (
          <motion.div
            key={student.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/30 transition-all cursor-pointer group"
            onClick={() => setSelectedStudent(student)}
          >
            {/* Student Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border-2 border-slate-600">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{student.name}</h3>
                  <p className="text-slate-400 text-xs">{student.email}</p>
                </div>
              </div>
              {student.paymentStatus === 'overdue' && (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              )}
            </div>

            {/* Belt and Stripes */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded text-xs font-bold ${getBeltColor(student.belt)}`}>
                {student.belt.charAt(0).toUpperCase() + student.belt.slice(1)}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: student.stripes }).map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-yellow-400 rounded-full" />
                ))}
                {Array.from({ length: 4 - student.stripes }).map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-slate-600 rounded-full" />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <p className="text-slate-400 text-xs">Presenças</p>
                <p className="text-white font-semibold">{student.attendance}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">XP</p>
                <p className="text-cyan-400 font-semibold">{student.xp}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Competições</p>
                <p className="text-white font-semibold">{student.competitionsParticipated}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Conquistas</p>
                <p className="text-yellow-400 font-semibold">{student.achievements.length}</p>
              </div>
            </div>

            {/* Payment Status */}
            <div className="mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(student.paymentStatus)}`}>
                {student.paymentStatus === 'current' ? 'Em dia' : 
                 student.paymentStatus === 'overdue' ? 'Atrasado' : 'Suspenso'}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePromoteStudent(student.id, 'stripe');
                }}
                className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
                title="Adicionar Fita"
              >
                <Award className="w-3 h-3 text-white" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePromoteStudent(student.id, 'belt');
                }}
                className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                title="Promover Faixa"
              >
                <Crown className="w-3 h-3 text-white" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                title="Enviar Mensagem"
              >
                <MessageSquare className="w-3 h-3 text-white" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Student Modal */}
      {showAddStudent && (
        <AddStudentModal 
          onClose={() => setShowAddStudent(false)}
          onAdd={(student) => {
            setStudents(prev => [...prev, student]);
            setShowAddStudent(false);
          }}
        />
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdate={(updatedStudent) => {
            setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
}

// Add Student Modal Component
function AddStudentModal({ onClose, onAdd }: { onClose: () => void, onAdd: (student: Student) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    belt: 'white',
    monthlyFee: 150,
    emergencyContact: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { mockAPI } = require('../../mock-data');
    const newStudent = mockAPI.addStudent({
      ...formData,
      stripes: 0,
      paymentStatus: 'current' as const,
      attendance: 0,
      xp: 0,
      level: 1,
      achievements: [],
      competitionsParticipated: 0,
      knownTechniques: [],
      lastAttendance: undefined
    });
    onAdd(newStudent);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <h3 className="text-xl font-bold text-white mb-4">Novo Aluno</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-sm mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:border-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:border-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">Telefone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:border-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">Faixa Inicial</label>
            <select
              value={formData.belt}
              onChange={(e) => setFormData(prev => ({ ...prev, belt: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:border-cyan-500 outline-none"
            >
              <option value="white">Branca</option>
              <option value="blue">Azul</option>
              <option value="purple">Roxa</option>
              <option value="brown">Marrom</option>
              <option value="black">Preta</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">Mensalidade (R$)</label>
            <input
              type="number"
              value={formData.monthlyFee}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyFee: parseInt(e.target.value) }))}
              className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:border-cyan-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-sm mb-1">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-lg focus:border-cyan-500 outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded-lg font-medium"
            >
              Adicionar Aluno
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium"
            >
              Cancelar
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Student Detail Modal - Placeholder for now
function StudentDetailModal({ student, onClose, onUpdate }: { 
  student: Student, 
  onClose: () => void,
  onUpdate: (student: Student) => void 
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Detalhes do Aluno</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
        
        {/* Student details here */}
        <div className="text-white">
          <h4 className="text-lg font-semibold">{student.name}</h4>
          <p className="text-slate-400">{student.email}</p>
          {/* Add more student details and editing capabilities */}
        </div>
      </motion.div>
    </div>
  );
}