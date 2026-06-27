import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthContextType {
  currentUser: SupabaseUser | null;
  adminUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  adminUser: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserChange(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserChange(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleUserChange = (user: SupabaseUser | null) => {
    setCurrentUser(user);
    if (user) {
      // In Supabase, if they are authenticated to the portfolio admin, we treat them as admin.
      // Sign up should be disabled in Supabase dashboard.
      setAdminUser({ uid: user.id, email: user.email || '', role: 'admin' });
    } else {
      setAdminUser(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    currentUser,
    adminUser,
    loading,
    isAdmin: !!adminUser,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
