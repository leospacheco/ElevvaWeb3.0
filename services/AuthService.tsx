import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { supabase } from './supabaseClient';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleAuthChange('INITIAL_SESSION', session);
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleAuthChange = async (event: AuthChangeEvent, session: Session | null) => {
    if (session?.user) {
      // CORREÇÃO: Captura explícita de 'error' para evitar travamento em falhas de RLS (406)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        // Se o perfil falhar (quase sempre RLS), loga o erro e NÃO define o usuário.
        console.error("Falha ao buscar perfil do usuário (RLS Issue):", profileError);
        // Deixa o 'setUser' para o estado 'null' (else) ou não faz nada, 
        // mantendo o usuário deslogado até que o RLS seja corrigido.
        setUser(null);
      }
      else if (profile) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: profile.name,
          role: profile.role as UserRole,
        });
      }
    } else {
      setUser(null);
    }
  };

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const register = async (name: string, email: string, pass: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          name: name,
        }
      }
    });

    if (error) return { error };

    // After successful sign up, create a profile entry
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name: name,
        role: UserRole.CUSTOMER
      });
      if (profileError) {
        // This is a tricky state. User is created in auth, but not in db.
        // For simplicity, we'll just return the error. A real app might need cleanup logic.
        return { error: profileError };
      }
    }

    return { error: null };
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
