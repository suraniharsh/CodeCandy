import { supabase } from '../config/supabase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
  lastLoginAt: string;
}

class AuthService {
  async signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }

  async signInWithGithub(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }

  async signOut(): Promise<void> {
    localStorage.removeItem('collections');
    localStorage.removeItem('snippets');
    localStorage.removeItem('favorites');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  sessionToProfile(session: NonNullable<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>): UserProfile {
    const { user } = session;
    const meta = user.user_metadata ?? {};
    return {
      uid: user.id,
      email: user.email ?? '',
      displayName: meta.full_name ?? meta.name ?? meta.user_name ?? '',
      photoURL: meta.avatar_url ?? meta.picture ?? '',
      createdAt: user.created_at,
      lastLoginAt: user.last_sign_in_at ?? user.created_at,
    };
  }
}

export const authService = new AuthService(); 