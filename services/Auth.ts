import { signInWithEmailAndPassword, signOut, AuthError, UserCredential, onAuthStateChanged, Unsubscribe } from "firebase/auth";
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db as firestore } from './firebase';
import { deleteUser} from "firebase/auth";

export interface UserData {
  email: string;
  role: 'user' | 'admin';
}

export const login = async (email: string, password: string): Promise<void> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in with:", userCredential.user);

    const userDocRef = doc(firestore, 'users', userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      const userData: UserData = {
        email: userCredential.user.email!,
        role: 'user',
      };
      await setDoc(userDocRef, userData); 
    }
  } catch (error) {
    handleError(error as AuthError, "Error logging in"); 
    throw error;
  }
};

export const deleteAccountFirebase = async ({ email, password, userId }: { email: string, password: string, userId: string }) => {
  if (!email || !password || !userId) {
    throw new Error('Missing required fields');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user.uid !== userId) {
      throw new Error('Invalid User ID');
    }

    await deleteUser(user);
  } catch (error: any) {
    throw new Error(`Failed to delete account: ${error.message}`);
  }
};


export const subscribeToAuthChanges = (setRole: (role: 'user' | 'admin' | null) => void): Unsubscribe => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserData;
          setRole(userData.role);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    } else {
      setRole(null);
    }
  });
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

const handleError = (error: AuthError, message: string): void => {
  switch (error.code) {
    case 'auth/invalid-email':
      console.error(`${message}: Invalid email address.`);
      break;
    case 'auth/user-disabled':
      console.error(`${message}: User account has been disabled.`);
      break;
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      console.error(`${message}: Invalid email or password.`);
      break;
    default:
      console.error(`${message}: ${error.message}`);
      break;
  }
}; 
