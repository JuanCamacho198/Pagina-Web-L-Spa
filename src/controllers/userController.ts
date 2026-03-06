// src/controllers/userController.ts
import {
  getUserById,
  updateUserData,
  deleteUserData
} from "../models/userModel";
import { auth } from "../lib/auth";
import { UserProfile } from "../types";

/**
 * Obtiene el perfil del usuario autenticado actualmente en Firebase.
 * @param setProfile - Función para setear el perfil en el estado de la UI.
 * @param setError - Función para manejar mensajes de error.
 */
export const fetchCurrentUser = async (
  setProfile: (profile: UserProfile | null) => void, 
  setError: (error: string) => void
): Promise<void> => {
  try {
    const current = auth.currentUser;
    if (!current) throw new Error("No hay usuario autenticado");
    
    const profile = await getUserById(current.uid);
    setProfile(profile);
  } catch (err: any) {
    console.error("[userController] fetchCurrentUser error:", err);
    setError(err.message || "Error al obtener el perfil");
  }
};

/**
 * Guarda los cambios realizados en el perfil del usuario.
 * @param updates - Objeto con los datos actualizados.
 * @param onSuccess - Callback tras actualización exitosa.
 * @param onError - Callback para manejar errores.
 */
export const saveProfileChanges = async (
  updates: Partial<UserProfile>, 
  onSuccess: () => void, 
  onError: (error: string) => void
): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No hay sesión activa para actualizar perfil");
    
    await updateUserData(user.uid, updates);
    onSuccess();
  } catch (err: any) {
    console.error("[userController] saveProfileChanges error:", err);
    onError(err.message || "Error al actualizar perfil");
  }
};

/**
 * Elimina la cuenta del usuario actual de Postgres y de Firebase Auth.
 * @param onSuccess - Callback tras eliminación exitosa.
 * @param onError - Callback para manejar errores.
 */
export const deleteCurrentUser = async (
  onSuccess: () => void, 
  onError: (error: string) => void
): Promise<void> => {
  console.log("[userController] deleteCurrentUser start");
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No hay usuario autenticado");
    const uid = user.uid;

    // 1) Borramos datos en PostgreSQL
    await deleteUserData(uid);
    console.log("[userController] Postgres user data deleted");

    // 2) Borramos usuario del Auth Mock
    await auth.deleteUser(); 
    console.log("[userController] Mock Auth user deleted");

    onSuccess();    
  } catch (err: any) {
    console.error("[userController] deleteCurrentUser error:", err);
    onError(err.message || "Error al eliminar la cuenta");
  }
};
