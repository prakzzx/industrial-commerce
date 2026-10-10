import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, RoleType, isCustomerRole } from '../types';

interface AuthContextType {
  currentUser: UserAccount | null;
  currentRole: RoleType;
  isLoggedIn: boolean;
  registeredUsersCount: number;
  setRole: (role: RoleType) => void;
  signIn: (userId: string, password: string) => { success: boolean; error?: string };
  register: (user: UserAccount) => { success: boolean; error?: string };
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Purely dynamic user registry: Zero hardcoded credentials. Starts empty or loads from localStorage.
  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem('indxo_registered_users');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const savedSession = localStorage.getItem('indxo_current_session');
      return savedSession ? JSON.parse(savedSession) : null;
    } catch {
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState<RoleType>(() => {
    return currentUser ? currentUser.role : 'CUSTOMER_BUYER';
  });

  useEffect(() => {
    localStorage.setItem('indxo_registered_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('indxo_current_session', JSON.stringify(currentUser));
      setCurrentRole(currentUser.role);
    } else {
      localStorage.removeItem('indxo_current_session');
    }
  }, [currentUser]);

  const setRole = (role: RoleType) => {
    setCurrentRole(role);
  };

  const signIn = (userId: string, password: string) => {
    const cleanId = userId.trim().toUpperCase();

    if (users.length === 0) {
      return {
        success: false,
        error: 'No accounts registered yet. Please click "Register / Sign Up" to create your Staff or Customer account.'
      };
    }

    // Find in dynamically registered users
    const matched = users.find(
      u => u.userId.toUpperCase() === cleanId && u.password === password
    );

    if (!matched) {
      return {
        success: false,
        error: `Invalid credentials for "${userId}". If you have not registered yet, please create an account first.`
      };
    }

    setCurrentUser(matched);
    setCurrentRole(matched.role);
    return { success: true };
  };

  const register = (newUser: UserAccount) => {
    const cleanId = newUser.userId.trim().toUpperCase();

    if (!cleanId) {
      return { success: false, error: 'User ID cannot be empty.' };
    }

    if (users.some(u => u.userId.toUpperCase() === cleanId)) {
      return { success: false, error: `User ID "${cleanId}" is already registered. Please choose a different User ID.` };
    }

    const created: UserAccount = {
      ...newUser,
      userId: cleanId,
      fullName: newUser.fullName.trim(),
      company: newUser.company.trim(),
      grade: newUser.grade || (isCustomerRole(newUser.role) ? 'Procurement Buyer' : 'Team Member'),
      email: `${cleanId.toLowerCase().replace(/\s+/g, '.')}@${newUser.company.toLowerCase().replace(/[^a-z]/g, '') || 'company'}.com`
    };

    const updated = [...users, created];
    setUsers(updated);
    setCurrentUser(created);
    setCurrentRole(created.role);
    return { success: true };
  };

  const signOut = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isLoggedIn: !!currentUser,
        registeredUsersCount: users.length,
        setRole,
        signIn,
        register,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
