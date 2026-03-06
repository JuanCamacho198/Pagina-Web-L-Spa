/**
 * Mock Auth para reemplazar Firebase Auth.
 * En un entorno real, aquí se usaría la SDK de Auth elegida (ej. Google One Tap, Auth0, etc.).
 */

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

// Estado simulado de autenticación
let currentUser: User | null = null;
const listeners: Array<(user: User | null) => void> = [];

export const auth = {
  get currentUser() {
    return currentUser;
  },
  
  // Simula el cambio de estado de autenticación
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    listeners.push(callback);
    callback(currentUser);
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    };
  },
  
  deleteUser: async (): Promise<void> => {
    currentUser = null;
    listeners.forEach(cb => cb(currentUser));
  }
};

/**
 * Función simulada para Login con Google (o Mock del MCP de Google)
 */
export const signInWithGoogle = async (): Promise<User> => {
  // Simulación de un ID externo (puedes cambiarlo según el MCP usado)
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
  listeners.forEach(cb => cb(currentUser));
};

export const deleteUser = async (): Promise<void> => {
  currentUser = null;
  listeners.forEach(cb => cb(currentUser));
};
