'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './components/LoginPage';
import InstructorDashboard from './components/dashboard/InstructorDashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';

type UserRole = 'student' | 'instructor' | null;

interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificação de auth usando mock API
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { mockAPI } = await import('./mock-data');
        const currentUser = mockAPI.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handler para login/logout
  const handleAuth = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('sharkbjj_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('sharkbjj_user');
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-shark-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Render appropriate dashboard based on user role
  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <LoginPage key="login" onLogin={handleAuth} />
      ) : user.role === 'instructor' ? (
        <InstructorDashboard key="instructor" user={user} onLogout={() => handleAuth(null)} />
      ) : (
        <StudentDashboard key="student" user={user} onLogout={() => handleAuth(null)} />
      )}
    </AnimatePresence>
  );
}