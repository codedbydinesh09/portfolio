import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { NeuCard, NeuInput, NeuButton } from '../../components/common';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !secretCode) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Very basic client-side secret check before auth request
      if (secretCode !== import.meta.env.VITE_ADMIN_SECRET) {
        throw new Error('Invalid Secret Code');
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      
      toast.success('Welcome to Admin Dashboard');
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <NeuCard className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full shadow-neu-inset flex items-center justify-center mb-6">
            <span className="text-3xl">🔒</span>
          </div>
          
          <h1 className="text-2xl font-bold text-neu-text mb-2">Admin Portal</h1>
          <p className="text-neu-muted mb-8 text-center text-sm">Secure access required. Please enter your credentials.</p>
          
          <form onSubmit={handleLogin} className="w-full space-y-5">
            <NeuInput
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <NeuInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <NeuInput
              type="password"
              placeholder="Secret Verification Code"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              required
            />
            
            <div className="pt-4">
              <NeuButton 
                type="submit" 
                variant="primary" 
                className="w-full"
                isLoading={loading}
              >
                Access Dashboard
              </NeuButton>
            </div>
          </form>
        </NeuCard>
      </div>
    </div>
  );
};

