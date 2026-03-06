// src/controllers/userController.ts
import {
  getAuth0UserById,
  updateUserData,
  deleteUserData
} from "../models/userModel";
import { UserProfile } from "../types";

/**
 * Obtiene el perfil del usuario de Postgres usando su ID de Auth0.
 * @param auth0Id - El ID de Auth0 del usuario.
 * @returns El perfil del usuario o null si no se encuentra.
 */
export const fetchUserProfile = async (
  auth0Id: string
): Promise<UserProfile | null> => {
  try {
    const profile = await getAuth0UserById(auth0Id);
    return profile;
  } catch (err: any) {
    console.error("[userController] fetchUserProfile error:", err);
    throw new Error(err.message || "Error al obtener el perfil");
  }
};

/**
 * Guarda los cambios realizados en el perfil del usuario.
 * @param auth0Id - El ID de Auth0 del usuario.
 * @param updates - Objeto con los datos actualizados.
 */
export const saveProfileChanges = async (
  auth0Id: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  try {
    await updateUserData(auth0Id, updates);
  } catch (err: any) {
    console.error("[userController] saveProfileChanges error:", err);
    throw new Error(err.message || "Error al actualizar perfil");
  }
};

/**
 * Elimina la cuenta (los datos de Postgres) del usuario actual.
 * @param auth0Id - El ID de Auth0 del usuario.
 */
export const deleteCurrentUser = async (
  auth0Id: string
): Promise<void> => {
  try {
    await deleteUserData(auth0Id);
  } catch (err: any) {
    console.error("[userController] deleteCurrentUser error:", err);
    throw new Error(err.message || "Error al eliminar cuenta");
  }
};
