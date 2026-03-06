/**
 * Mock Auth para reemplazar Firebase Auth.
 */
export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

let currentUser: User | null = null;
const listeners: Array<(user: User | null) => void> = [];

export const getAuth = () => auth;

export const auth = {
  get currentUser() {
    return currentUser;
  },
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    listeners.push(callback);
    callback(currentUser);
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    };
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  const mockUser: User = {
    uid: "google-mock-uid-123456",
    email: "user@example.com",
    displayName: "Mock User Google"
  };
  currentUser = mockUser;
  listeners.forEach(cb => cb(currentUser));
  return mockUser;
};

export const signOut = async (): Promise<void> => {
  currentUser = null;
  listeners.forEach(cb => cb(null));
};

export const deleteUser = async (): Promise<void> => {
  currentUser = null;
  listeners.forEach(cb => cb(null));
};
