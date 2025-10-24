
import React, { useState, FormEvent, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthService';
import { Logo, Button, Input, Card } from '../components/ui';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useAuth();

  const [isLogin, setIsLogin] = useState(location.pathname === '/login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLogin(location.pathname === '/login');
  }, [location.pathname]);

  // leospacheco/elevvaweb3.0/ElevvaWeb3.0-71c8c7c88d49f2fb927a079df654fa2ccb0fda15/pages/AuthPage.tsx

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result: { error: any | null };

      if (isLogin) {
        result = await auth.login(email, password);

        if (result.error) {
          setError(result.error.message || 'Credenciais inválidas. Por favor, tente novamente.');
        } else {
          // CORREÇÃO: Reseta o estado de carregamento do botão imediatamente antes de navegar
          setLoading(false);
          navigate('/dashboard');
          return;
        }

      } else {
        result = await auth.register(name, email, password);

        if (result.error) {
          setError(result.error.message || 'Ocorreu um erro no registro.');
        } else {
          // CORREÇÃO: Reseta o estado de carregamento do botão imediatamente antes de navegar
          setLoading(false);
          navigate('/dashboard');
          return;
        }
      }
    } catch (err) {
      setError('Ocorreu um erro. Por favor, tente novamente mais tarde.');
    } finally {
      // Mantemos o finally, mas o setLoading é redundante após a correção,
      // ele serve apenas para erros gerais antes da lógica do Supabase.
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="mb-8">
        <Link to="/">
          <Logo className="h-16" />
        </Link>
      </div>
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLogin ? 'Acessar sua Conta' : 'Criar nova Conta'}
        </h2>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Nome Completo</label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Seu nome"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="voce@exemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Senha</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full !py-3" disabled={loading}>
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Registrar')}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
          <Link to={isLogin ? '/register' : '/login'} className="font-medium text-elevva-blue hover:underline">
            {isLogin ? 'Registre-se' : 'Faça login'}
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default AuthPage;
