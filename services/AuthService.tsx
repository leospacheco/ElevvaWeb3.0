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
      // CORREÇÃO: Usamos .select('*, profiles(*)') para lidar com o erro
      // de forma segura e explícita.
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile) {
        // Se a busca falhar (porque o perfil não existe ou RLS está ativo),
        // registramos o erro no console (invisível na tela) e definimos o usuário como null.
        console.error("Falha ao buscar perfil do usuário. Erro:", profileError);
        setUser(null);
      }
      else {
        // Sucesso: Perfil encontrado.
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
      // FIX DE DEBUG: Exibe o erro de inserção do perfil (RLS) no console.
      console.error("Supabase Profile INSERT failed - RLS likely:", profileError);
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
