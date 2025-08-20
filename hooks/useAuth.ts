import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile } from '@/lib/firestore';
import type { User as UserProfile } from '@/lib/firestore';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setAuthState({
          user,
          profile,
          loading: false,
        });
      } else {
        setAuthState({
          user: null,
          profile: null,
          loading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
}
