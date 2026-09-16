'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import UnauthorizedDomainModal from '@/components/UnauthorizedDomainModal';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  openDomainModal: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  openDomainModal: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [modalErrorType, setModalErrorType] = useState<
    'unauthorized-domain' | 'internal-error' | 'general'
  >('unauthorized-domain');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Sync basic user profile to Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (!docSnap.exists()) {
            await setDoc(userDocRef, {
              userId: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'مستخدم',
              photoURL: user.photoURL || '',
              createdAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.warn('User profile sync note:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openDomainModal = () => {
    setModalErrorType('unauthorized-domain');
    setShowDomainModal(true);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Google Sign-In error captured:', error);
      const errCode = error?.code || '';
      const errMsg = error?.message || '';

      if (errCode === 'auth/popup-closed-by-user') {
        // User voluntarily closed the sign-in popup
        return;
      }

      if (
        errCode === 'auth/unauthorized-domain' ||
        errMsg.includes('unauthorized-domain')
      ) {
        setModalErrorType('unauthorized-domain');
        setShowDomainModal(true);
      } else if (
        errCode === 'auth/internal-error' ||
        errMsg.includes('internal-error')
      ) {
        setModalErrorType('internal-error');
        setShowDomainModal(true);
      } else {
        setModalErrorType('general');
        setShowDomainModal(true);
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign-Out error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, loading, signInWithGoogle, logout, openDomainModal }}
    >
      {children}
      <UnauthorizedDomainModal
        isOpen={showDomainModal}
        errorType={modalErrorType}
        onClose={() => setShowDomainModal(false)}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

