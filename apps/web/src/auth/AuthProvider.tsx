import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, getStoredToken, setStoredToken, AUTH_USER_KEY, apiEvents } from '../api/client';
import type { UserRole } from '@contracts';

export const DEV_SESSION_KEY = 'onecheck_dev_session';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDevSession: boolean;
  login: (email: string, roleHint?: UserRole) => Promise<User>;
  devBypassLogin: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_DEV_USERS: Record<string, User> = {
  INSTITUTION: {
    id: 'dev-mock-inst',
    name: 'Dr. R. K. Sharma (Testing Official)',
    email: 'institution@apex-tech.edu.in',
    role: 'INSTITUTION',
    institutionName: 'Apex Institute of Technology',
  },
  SCRUTINY_OFFICER: {
    id: 'dev-mock-officer',
    name: 'Shri V. S. Rao (Testing Officer)',
    email: 'officer.rao@aicte.gov.in',
    role: 'SCRUTINY_OFFICER',
    institutionName: 'AICTE Northern Regional Office',
  },
  REGIONAL_DIRECTOR: {
    id: 'dev-mock-director',
    name: 'Dr. Sunita Deshmukh (Testing Director)',
    email: 'director@aicte.gov.in',
    role: 'REGIONAL_DIRECTOR',
    institutionName: 'AICTE Central Headquarters',
  },
  ADMIN: {
    id: 'dev-mock-admin',
    name: 'System Admin (Testing Mode)',
    email: 'admin@aicte.gov.in',
    role: 'ADMIN',
    institutionName: 'AICTE e-Governance Cell',
  },
  AUDITOR: {
    id: 'dev-mock-auditor',
    name: 'Senior Auditor (Testing Mode)',
    email: 'auditor@cag.gov.in',
    role: 'AUDITOR',
    institutionName: 'CAG Compliance Cell',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDevSession, setIsDevSession] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(DEV_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const navigate = useNavigate();

  // Listen to 401 unauthorized emitted by axios interceptor
  useEffect(() => {
    const unsubscribe = apiEvents.on('401_UNAUTHORIZED', () => {
      logout();
      navigate('/login');
    });
    return unsubscribe;
  }, [navigate]);

  const routeByRole = (role: UserRole) => {
    switch (role) {
      case 'INSTITUTION':
        navigate('/portal');
        break;
      case 'SCRUTINY_OFFICER':
      case 'REGIONAL_DIRECTOR':
        navigate('/review');
        break;
      case 'ADMIN':
        navigate('/admin/rulepacks');
        break;
      case 'AUDITOR':
        navigate('/audit');
        break;
      default:
        navigate('/portal');
    }
  };

  const login = async (email: string, roleHint?: UserRole): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/login', { email, roleHint });
      const { token: receivedToken, user: receivedUser } = res.data.data;

      setStoredToken(receivedToken);
      sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(receivedUser));
      sessionStorage.removeItem(DEV_SESSION_KEY);

      setToken(receivedToken);
      setUser(receivedUser);
      setIsDevSession(false);

      routeByRole(receivedUser.role);
      return receivedUser;
    } finally {
      setIsLoading(false);
    }
  };

  // Development-Only Bypass Login
  const devBypassLogin = (role: UserRole) => {
    // Strictly guarded against execution in production
    if (!import.meta.env.DEV) {
      console.warn('Development bypass login is disabled in production.');
      return;
    }

    const mockUser = MOCK_DEV_USERS[role] || MOCK_DEV_USERS.INSTITUTION;
    const mockToken = `dev-mock-jwt-token-for-${role.toLowerCase()}`;

    setStoredToken(mockToken);
    sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
    sessionStorage.setItem(DEV_SESSION_KEY, 'true');

    setToken(mockToken);
    setUser(mockUser);
    setIsDevSession(true);

    routeByRole(mockUser.role);
  };

  const logout = () => {
    setStoredToken(null);
    sessionStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(DEV_SESSION_KEY);
    setToken(null);
    setUser(null);
    setIsDevSession(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        isDevSession,
        login,
        devBypassLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
