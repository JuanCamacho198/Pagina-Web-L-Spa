// src/models/authModel.ts
import { auth } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from "firebase/auth";

const Registro = (correo: string, contrasena: string): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, correo, contrasena);

const Login = (correo: string, contrasena: string): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, correo, contrasena);

const Logout = (): Promise<void> => signOut(auth);

const AuthModel = { auth, Registro, Login, Logout };
export default AuthModel;
