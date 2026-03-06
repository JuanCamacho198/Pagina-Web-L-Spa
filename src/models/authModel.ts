// src/models/authModel.ts
import { auth, signInWithGoogle, signOut } from "../lib/auth";

const Registro = async (correo: string, contrasena: string) => {
  // Mock de registro que usa Google Auth por ahora
  return signInWithGoogle();
};

const Login = async (correo: string, contrasena: string) => {
  // Mock de login
  return signInWithGoogle();
};

const Logout = (): Promise<void> => signOut();

const AuthModel = { auth, Registro, Login, Logout };
export default AuthModel;
