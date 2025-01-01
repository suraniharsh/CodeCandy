import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: string;
  lastLoginAt: string;
}

class AuthService {
  private currentUser: User | null = null;
  private userProfile: UserProfile | null = null;

  constructor() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      if (user) {
        this.userProfile = await this.createUserProfile(user);
      } else {
        this.userProfile = null;
      }
    });
  }

  async signInWithGoogle(): Promise<UserProfile | null> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      this.currentUser = result.user;
      this.userProfile = await this.createUserProfile(result.user);
      return this.userProfile;
    } catch (error) {
      console.error('Google sign-in error:', error);
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
      this.currentUser = null;
      this.userProfile = null;
      // Clear any local storage data
      localStorage.removeItem('collections');
      localStorage.removeItem('snippets');
      localStorage.removeItem('favorites');
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }

  async createUserProfile(user: User): Promise<UserProfile> {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: userSnap.exists() 
          ? userSnap.data().createdAt 
          : new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      await setDoc(userRef, userProfile, { merge: true });
      this.userProfile = userProfile;
      return userProfile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getUserProfile(): UserProfile | null {
    if (!this.currentUser) {
      return null;
    }
    return this.userProfile;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && !!this.userProfile;
  }
}

export const authService = new AuthService(); 