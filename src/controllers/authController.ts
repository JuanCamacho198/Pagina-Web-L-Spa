// src/controllers/authController.ts
import AuthModel from "@/models/authModel";
import { saveUserData, getUserById } from "@/models/userModel";    

/**
 * Registra un usuario en Firebase Authentication y guarda sus datos en PostgreSQL.
 * @param nombre - Nombre del usuario.
 * @param apellido - Apellido del usuario.
 * @param correo - Email del usuario.
 * @param contrasena - Contraseña del usuario.
 * @param navigate - Función de navegación de React Router.
 * @param registroError - Función para manejar mensajes de error en la UI.
 */
export const registroUsuario = async (
  nombre: string,
  apellido: string,
  correo: string,
  contrasena: string,
  navigate: (path: string) => void,
  registroError: (error: string) => void
): Promise<void> => {
  try {
    console.log("[authController] Intentando registrar usuario...");
    const user = await AuthModel.Registro(correo, contrasena);
    const uid = user.uid;

    // Guardado en Postgres via Drizzle
    await saveUserData(uid, nombre, apellido, correo);

    // Verificación en Postgres opcional
    const dbUser = await getUserById(uid);
    if (dbUser) {
      console.log("[authController] ✔ Registro en Postgres exitoso:", dbUser);
    } else {
      console.warn("[authController] ⚠ Registro NO ENCONTRADO tras insert en Postgres");
    }

    navigate("/home");
  } catch (error: any) {
    console.error("[authController] Error en registroUsuario:", error);
    registroError(error.message || "Error al registrarse");
  }
};

/**
 * Inicia sesión de un usuario con Firebase Auth.
 * @param correo - Email del usuario.
 * @param contrasena - Contraseña del usuario.
 * @param navigate - Función de navegación.
 * @param loginError - Función para manejar errores.
 */
export const loginUsuario = async (
  correo: string, 
  contrasena: string, 
  navigate: (path: string) => void, 
  loginError: (error: string) => void
): Promise<void> => {
  try {
    await AuthModel.Login(correo, contrasena);
    navigate("/home");
  } catch (error: any) {
    console.error("[authController] Error en loginUsuario:", error);
    loginError(error.message || "Credenciales inválidas");
  }
};
