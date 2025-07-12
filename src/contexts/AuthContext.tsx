import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { User } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Here you would typically save user data to your backend/MongoDB
    const newUser: User = {
      uid: result.user.uid,
      email: result.user.email || '',
      name,
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      isPublic: true,
      rating: 0,
      totalRatings: 0,
      createdAt: new Date(),
      isAdmin: email.toLowerCase() === 'admin123@gmail.com'
    };
    setUserData(newUser);
    // Save to backend API here
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    // Check if user exists in your backend, if not create them
    const newUser: User = {
      uid: result.user.uid,
      email: result.user.email || '',
      name: result.user.displayName || '',
      profilePhoto: result.user.photoURL || undefined,
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      isPublic: true,
      rating: 0,
      totalRatings: 0,
      createdAt: new Date(),
      isAdmin: result.user.email?.toLowerCase() === 'admin123@gmail.com'
    };
    setUserData(newUser);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user data from your backend here
        // For demo purposes, we'll create mock data
        if (user.email?.toLowerCase() === 'admin123@gmail.com') {
          setUserData({
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || 'Admin User',
            skillsOffered: [],
            skillsWanted: [],
            availability: [],
            isPublic: true,
            rating: 5,
            totalRatings: 1,
            createdAt: new Date(),
            isAdmin: true
          });
        } else {
          setUserData({
            uid: user.uid,
            email: user.email || '',
            name: user.displayName || 'User',
            profilePhoto: user.photoURL || undefined,
            skillsOffered: ['JavaScript', 'React'],
            skillsWanted: ['Python', 'Design'],
            availability: ['Weekends', 'Evenings'],
            isPublic: true,
            rating: 4.5,
            totalRatings: 12,
            createdAt: new Date()
          });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    login,
    register,
    loginWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};