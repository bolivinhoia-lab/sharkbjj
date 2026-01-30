// Sistema de dados mock local para desenvolvimento
// Remove a dependência do Supabase para testes

export interface Student {
  id: string;
  name: string;
  email: string;
  belt: 'white' | 'blue' | 'purple' | 'brown' | 'black';
  stripes: number;
  attendance: number;
  xp: number;
  level: number;
  joinDate: string;
  lastAttendance?: string;
  qrCode: string;
  paymentStatus: 'current' | 'overdue' | 'suspended';
  lastPaymentDate?: string;
  monthlyFee: number;
  knownTechniques: string[];
  achievements: string[];
  competitionsParticipated: number;
  notes: string;
  emergencyContact?: string;
  phone?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  type: 'attendance' | 'technique' | 'competition' | 'belt' | 'social';
  requirements: any;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'message' | 'announcement' | 'absence';
}

export interface ClassSchedule {
  id: string;
  name: string;
  instructor: string;
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
  level: string;
  type: 'gi' | 'no-gi' | 'open-mat' | 'competition';
}

export interface Instructor {
  id: string;
  name: string;
  email: string;
  belt: 'purple' | 'brown' | 'black';
  academyId: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  timestamp: string;
  instructorId: string;
  classType: 'gi' | 'no-gi' | 'open-mat';
}

// Mock achievements
const mockAchievements: Achievement[] = [
  { id: 'streak_7', name: 'Guerreiro Consistente', description: '7 dias consecutivos treinando', icon: '🔥', xpReward: 100, type: 'attendance', requirements: { streakDays: 7 } },
  { id: 'mount_master', name: 'Mestre da Montada', description: 'Dominou todas as técnicas de montada', icon: '⛰️', xpReward: 150, type: 'technique', requirements: { techniques: ['mount_escape', 'mount_submissions', 'mount_transitions'] } },
  { id: 'first_comp', name: 'Competidor Iniciante', description: 'Primeira competição', icon: '🏆', xpReward: 200, type: 'competition', requirements: { competitions: 1 } },
  { id: 'belt_promotion', name: 'Evolução', description: 'Promoção de faixa', icon: '🥋', xpReward: 500, type: 'belt', requirements: { beltChange: true } },
  { id: 'helper', name: 'Mentor', description: 'Ajudou 10 iniciantes', icon: '🤝', xpReward: 75, type: 'social', requirements: { studentsHelped: 10 } }
];

// Mock students - dados mais realistas
const mockStudents: Student[] = [
  {
    id: 'student1',
    name: 'João Silva',
    email: 'joao@example.com',
    belt: 'blue',
    stripes: 2,
    attendance: 45,
    xp: 2150,
    level: 8,
    joinDate: '2023-01-15',
    lastAttendance: '2026-01-29',
    qrCode: 'QR_STUDENT_1_' + Date.now(),
    paymentStatus: 'current',
    lastPaymentDate: '2026-01-01',
    monthlyFee: 150,
    knownTechniques: ['mount_escape', 'triangle_choke', 'armbar_guard', 'hip_toss'],
    achievements: ['streak_7', 'first_comp'],
    competitionsParticipated: 2,
    notes: 'Aluno dedicado, boa progressão técnica',
    phone: '+55 11 99999-0001',
    emergencyContact: 'Maria Silva - +55 11 88888-0001'
  },
  {
    id: 'student2', 
    name: 'Maria Santos',
    email: 'maria@example.com',
    belt: 'white',
    stripes: 3,
    attendance: 23,
    xp: 1200,
    level: 4,
    joinDate: '2024-06-10',
    lastAttendance: '2026-01-28',
    qrCode: 'QR_STUDENT_2_' + Date.now(),
    paymentStatus: 'overdue',
    lastPaymentDate: '2025-12-01',
    monthlyFee: 150,
    knownTechniques: ['basic_guard', 'mount_escape', 'side_control_escape'],
    achievements: [],
    competitionsParticipated: 0,
    notes: 'Iniciante promissora, precisa de mais consistência',
    phone: '+55 11 99999-0002'
  },
  {
    id: 'student3',
    name: 'Pedro Costa',
    email: 'pedro@example.com', 
    belt: 'purple',
    stripes: 1,
    attendance: 89,
    xp: 4500,
    level: 15,
    joinDate: '2022-03-20',
    lastAttendance: '2026-01-30',
    qrCode: 'QR_STUDENT_3_' + Date.now(),
    paymentStatus: 'current',
    lastPaymentDate: '2026-01-15',
    monthlyFee: 150,
    knownTechniques: ['mount_escape', 'triangle_choke', 'armbar_guard', 'hip_toss', 'berimbolo', 'heel_hook', 'knee_slice'],
    achievements: ['streak_7', 'mount_master', 'first_comp', 'belt_promotion'],
    competitionsParticipated: 8,
    notes: 'Competidor experiente, ajuda outros alunos',
    phone: '+55 11 99999-0003',
    emergencyContact: 'Ana Costa - +55 11 88888-0003'
  },
  {
    id: 'student4',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@example.com',
    belt: 'brown',
    stripes: 0,
    attendance: 112,
    xp: 6500,
    level: 22,
    joinDate: '2020-08-10',
    lastAttendance: '2026-01-30',
    qrCode: 'QR_STUDENT_4_' + Date.now(),
    paymentStatus: 'current',
    lastPaymentDate: '2026-01-15',
    monthlyFee: 150,
    knownTechniques: ['mount_escape', 'triangle_choke', 'armbar_guard', 'hip_toss', 'berimbolo', 'heel_hook', 'knee_slice', 'deep_half', 'x_guard'],
    achievements: ['streak_7', 'mount_master', 'first_comp', 'belt_promotion', 'helper'],
    competitionsParticipated: 15,
    notes: 'Futuro faixa preta, líder natural',
    phone: '+55 11 99999-0004',
    emergencyContact: 'Lucia Mendes - +55 11 88888-0004'
  }
];

// Mock messages
const mockMessages: Message[] = [
  {
    id: 'msg1',
    fromId: 'instructor1', 
    toId: 'student1',
    content: 'Parabéns pela evolução! Continue focando na guarda fechada.',
    timestamp: '2026-01-29T10:00:00Z',
    read: true,
    type: 'message'
  },
  {
    id: 'msg2',
    fromId: 'student2',
    toId: 'instructor1', 
    content: 'Professor, estarei ausente na próxima semana por motivos de viagem.',
    timestamp: '2026-01-28T15:30:00Z',
    read: false,
    type: 'absence'
  },
  {
    id: 'msg3',
    fromId: 'instructor1',
    toId: 'all',
    content: 'Lembrete: Competição Copacabana Open em 15 de fevereiro. Inscrições abertas!',
    timestamp: '2026-01-25T09:00:00Z',
    read: true,
    type: 'announcement'
  }
];

// Mock class schedule
const mockSchedule: ClassSchedule[] = [
  { id: 'class1', name: 'Fundamentals', instructor: 'Prof. Carlos', dayOfWeek: 1, startTime: '19:00', endTime: '20:30', level: 'Iniciante', type: 'gi' },
  { id: 'class2', name: 'Advanced Gi', instructor: 'Prof. Carlos', dayOfWeek: 1, startTime: '20:30', endTime: '22:00', level: 'Avançado', type: 'gi' },
  { id: 'class3', name: 'No-Gi', instructor: 'Prof. Carlos', dayOfWeek: 2, startTime: '19:00', endTime: '20:30', level: 'Todos', type: 'no-gi' },
  { id: 'class4', name: 'Competition Team', instructor: 'Prof. Carlos', dayOfWeek: 3, startTime: '20:30', endTime: '22:00', level: 'Competição', type: 'no-gi' },
  { id: 'class5', name: 'Open Mat', instructor: 'Livre', dayOfWeek: 5, startTime: '19:00', endTime: '21:00', level: 'Todos', type: 'open-mat' },
  { id: 'class6', name: 'Women Only', instructor: 'Prof. Ana', dayOfWeek: 6, startTime: '10:00', endTime: '11:30', level: 'Todos', type: 'gi' }
];

// Mock instructors
const mockInstructors: Instructor[] = [
  {
    id: 'instructor1',
    name: 'Professor Carlos Silva',
    email: 'carlos@sharkbjj.com',
    belt: 'black',
    academyId: 'academy1'
  }
];

// Storage local
const STORAGE_KEYS = {
  students: 'sharkbjj_students',
  instructors: 'sharkbjj_instructors', 
  attendance: 'sharkbjj_attendance',
  currentUser: 'sharkbjj_user'
};

// Utilitários de storage
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  },
  
  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// API Mock
export const mockAPI = {
  // Estudantes
  getStudents: (): Student[] => {
    return storage.get(STORAGE_KEYS.students, mockStudents);
  },

  getStudentById: (id: string): Student | null => {
    const students = mockAPI.getStudents();
    return students.find(s => s.id === id) || null;
  },

  updateStudent: (id: string, data: Partial<Student>): Student | null => {
    const students = mockAPI.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    students[index] = { ...students[index], ...data };
    storage.set(STORAGE_KEYS.students, students);
    return students[index];
  },

  // Instrutores  
  getInstructors: (): Instructor[] => {
    return storage.get(STORAGE_KEYS.instructors, mockInstructors);
  },

  getInstructorById: (id: string): Instructor | null => {
    const instructors = mockAPI.getInstructors();
    return instructors.find(i => i.id === id) || null;
  },

  // Attendance
  getAttendance: (): Attendance[] => {
    return storage.get(STORAGE_KEYS.attendance, []);
  },

  addAttendance: (studentId: string, instructorId: string, classType: 'gi' | 'no-gi' | 'open-mat' = 'gi'): Attendance => {
    const attendance = mockAPI.getAttendance();
    const newRecord: Attendance = {
      id: 'att_' + Date.now(),
      studentId,
      instructorId,
      classType,
      timestamp: new Date().toISOString()
    };
    
    attendance.push(newRecord);
    storage.set(STORAGE_KEYS.attendance, attendance);
    
    // Atualizar XP e attendance do estudante
    const student = mockAPI.getStudentById(studentId);
    if (student) {
      mockAPI.updateStudent(studentId, {
        attendance: student.attendance + 1,
        xp: student.xp + 50,
        level: Math.floor((student.xp + 50) / 300),
        lastAttendance: new Date().toISOString().split('T')[0]
      });
    }
    
    return newRecord;
  },

  // QR Code scanning
  scanQRCode: (qrData: string, instructorId: string): { success: boolean; student?: Student; message: string } => {
    try {
      // Extrair ID do estudante do QR code
      const studentId = qrData.replace(/^QR_STUDENT_(\d+)_.*/, 'student$1');
      const student = mockAPI.getStudentById(studentId);
      
      if (!student) {
        return { success: false, message: 'QR Code inválido ou estudante não encontrado' };
      }

      // Verificar se já fez check-in hoje
      const today = new Date().toISOString().split('T')[0];
      const todayAttendance = mockAPI.getAttendance().filter(a => 
        a.studentId === studentId && 
        a.timestamp.startsWith(today)
      );

      if (todayAttendance.length > 0) {
        return { success: false, student, message: 'Estudante já fez check-in hoje!' };
      }

      // Fazer check-in
      mockAPI.addAttendance(studentId, instructorId);
      const updatedStudent = mockAPI.getStudentById(studentId)!;
      
      return { 
        success: true, 
        student: updatedStudent, 
        message: `Check-in realizado! ${student.name} +50 XP` 
      };
      
    } catch (error) {
      return { success: false, message: 'Erro ao processar QR Code' };
    }
  },

  // Gerar QR Code para estudante
  generateStudentQRCode: (studentId: string): string => {
    const timestamp = Date.now();
    return `QR_${studentId.toUpperCase()}_${timestamp}`;
  },

  // Auth mock
  login: (email: string, password: string): { success: boolean; user?: any; message: string } => {
    // Mock login - aceita qualquer email/senha
    const isInstructor = email.includes('instructor') || email.includes('professor') || email.includes('carlos');
    const isStudent = !isInstructor;

    if (isInstructor) {
      const instructor = mockInstructors[0];
      const user = {
        id: instructor.id,
        email: instructor.email,
        name: instructor.name,
        role: 'instructor' as const
      };
      storage.set(STORAGE_KEYS.currentUser, user);
      return { success: true, user, message: 'Login realizado com sucesso!' };
    }

    if (isStudent) {
      // Criar/encontrar estudante
      let student = mockStudents.find(s => s.email === email);
      if (!student) {
        student = {
          id: 'student_' + Date.now(),
          name: email.split('@')[0],
          email,
          belt: 'white',
          stripes: 0,
          attendance: 0,
          xp: 0,
          level: 1,
          joinDate: new Date().toISOString().split('T')[0],
          qrCode: 'QR_STUDENT_' + Date.now(),
          paymentStatus: 'current',
          monthlyFee: 150,
          knownTechniques: [],
          achievements: [],
          competitionsParticipated: 0,
          notes: ''
        };
        mockStudents.push(student);
        storage.set(STORAGE_KEYS.students, mockStudents);
      }
      
      const user = {
        id: student.id,
        email: student.email,
        name: student.name,
        role: 'student' as const
      };
      storage.set(STORAGE_KEYS.currentUser, user);
      return { success: true, user, message: 'Login realizado com sucesso!' };
    }

    return { success: false, message: 'Email ou senha inválidos' };
  },

  logout: () => {
    storage.set(STORAGE_KEYS.currentUser, null);
  },

  getCurrentUser: () => {
    return storage.get(STORAGE_KEYS.currentUser, null);
  },

  // === FUNCIONALIDADES DO INSTRUTOR ===
  
  // Adicionar novo aluno
  addStudent: (studentData: Omit<Student, 'id' | 'qrCode' | 'joinDate'>): Student => {
    const students = mockAPI.getStudents();
    const newStudent: Student = {
      ...studentData,
      id: 'student_' + Date.now(),
      qrCode: 'QR_STUDENT_' + Date.now(),
      joinDate: new Date().toISOString().split('T')[0],
      xp: 0,
      level: 1,
      attendance: 0,
      achievements: [],
      competitionsParticipated: 0,
      knownTechniques: [],
      notes: '',
    };
    students.push(newStudent);
    storage.set(STORAGE_KEYS.students, students);
    return newStudent;
  },

  // Promover aluno (faixa/fita)
  promoteStudent: (studentId: string, newBelt?: string, newStripes?: number): Student | null => {
    const students = mockAPI.getStudents();
    const studentIndex = students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return null;

    const student = students[studentIndex];
    const oldBelt = student.belt;
    
    if (newBelt) {
      student.belt = newBelt as any;
      student.stripes = 0;
      student.xp += 500; // XP por promoção de faixa
      student.achievements.push('belt_promotion');
    } else if (newStripes !== undefined) {
      student.stripes = Math.min(newStripes, 4);
      student.xp += 100; // XP por fita
    }

    students[studentIndex] = student;
    storage.set(STORAGE_KEYS.students, students);
    return student;
  },

  // Sistema de mensagens
  getMessages: (userId?: string): Message[] => {
    const messages = storage.get('sharkbjj_messages', mockMessages);
    if (!userId) return messages;
    return messages.filter(m => m.fromId === userId || m.toId === userId || m.toId === 'all');
  },

  sendMessage: (fromId: string, toId: string, content: string, type: 'message' | 'announcement' | 'absence' = 'message'): Message => {
    const messages = mockAPI.getMessages();
    const newMessage: Message = {
      id: 'msg_' + Date.now(),
      fromId,
      toId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    messages.push(newMessage);
    storage.set('sharkbjj_messages', messages);
    return newMessage;
  },

  markMessageRead: (messageId: string): boolean => {
    const messages = mockAPI.getMessages();
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return false;
    
    messages[messageIndex].read = true;
    storage.set('sharkbjj_messages', messages);
    return true;
  },

  // Cronograma de aulas
  getSchedule: (): ClassSchedule[] => {
    return storage.get('sharkbjj_schedule', mockSchedule);
  },

  addScheduleClass: (classData: Omit<ClassSchedule, 'id'>): ClassSchedule => {
    const schedule = mockAPI.getSchedule();
    const newClass: ClassSchedule = {
      ...classData,
      id: 'class_' + Date.now()
    };
    schedule.push(newClass);
    storage.set('sharkbjj_schedule', schedule);
    return newClass;
  },

  // Conquistas/Achievements
  getAchievements: (): Achievement[] => {
    return mockAchievements;
  },

  awardAchievement: (studentId: string, achievementId: string): boolean => {
    const student = mockAPI.getStudentById(studentId);
    if (!student || student.achievements.includes(achievementId)) return false;
    
    const achievement = mockAchievements.find(a => a.id === achievementId);
    if (!achievement) return false;

    student.achievements.push(achievementId);
    student.xp += achievement.xpReward;
    mockAPI.updateStudent(studentId, student);
    return true;
  },

  // Relatórios e Analytics
  getAcademyStats: () => {
    const students = mockAPI.getStudents();
    const attendance = mockAPI.getAttendance();
    
    return {
      totalStudents: students.length,
      activeStudents: students.filter(s => s.paymentStatus === 'current').length,
      overduePayments: students.filter(s => s.paymentStatus === 'overdue').length,
      totalClasses: attendance.length,
      averageAttendance: students.reduce((acc, s) => acc + s.attendance, 0) / students.length,
      beltDistribution: {
        white: students.filter(s => s.belt === 'white').length,
        blue: students.filter(s => s.belt === 'blue').length,
        purple: students.filter(s => s.belt === 'purple').length,
        brown: students.filter(s => s.belt === 'brown').length,
        black: students.filter(s => s.belt === 'black').length,
      },
      monthlyRevenue: students.filter(s => s.paymentStatus === 'current').reduce((acc, s) => acc + s.monthlyFee, 0)
    };
  },

  // Remover aluno
  removeStudent: (studentId: string): boolean => {
    const students = mockAPI.getStudents();
    const filteredStudents = students.filter(s => s.id !== studentId);
    if (filteredStudents.length === students.length) return false;
    
    storage.set(STORAGE_KEYS.students, filteredStudents);
    return true;
  }
};