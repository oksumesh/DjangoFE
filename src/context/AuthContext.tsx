import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { loginApi, registerApi, googleAuthApi } from '../services/auth';
import { GoogleUserInfo } from '../services/googleAuth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id'> & { password: string; firstName: string; lastName: string }) => Promise<void>;
  googleLogin: (googleUserInfo: GoogleUserInfo) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await loginApi(email, password);
      localStorage.setItem('access', data.token);
      localStorage.setItem('refresh', data.refresh || '');
      const userWithName = { 
        ...data.user, 
        name: `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() || data.user.email 
      };
      localStorage.setItem('user', JSON.stringify(userWithName));
      setUser(userWithName);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id'> & { password: string; firstName: string; lastName: string }) => {
    setIsLoading(true);
    try {
      await registerApi(userData.email, userData.password, userData.firstName, userData.lastName);
      await login(userData.email, userData.password);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (googleUserInfo: GoogleUserInfo) => {
    setIsLoading(true);
    try {
      const data = await googleAuthApi(googleUserInfo.idToken);
      localStorage.setItem('access', data.token);
      localStorage.setItem('refresh', data.refresh || '');
      const userWithName = { 
        ...data.user, 
        name: `${data.user.first_name || ''} ${data.user.last_name || ''}`.trim() || data.user.email 
      };
      localStorage.setItem('user', JSON.stringify(userWithName));
      setUser(userWithName);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, googleLogin, logout, isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};