// src/models/userModel.ts
import { UserProfile } from "@/types";

const API_URL = '/api/users';

/**
 * Guarda (o crea) un perfil de usuario en la base de datos Postgres via API.
 * @param userData - Objeto con los datos del usuario.
 */
export async function saveUserData(userData: {
  auth0Id: string;
  email: string;
  name: string;
  role?: 'admin' | 'employee' | 'customer';
}) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error('Error al sincronizar usuario');
  return response.json();
}

/**
 * Trae un perfil de usuario por su Auth0 ID via API.
 * @param auth0Id - El ID de Auth0.
 * @returns El perfil de usuario mapeado.
 */
export async function getAuth0UserById(auth0Id: string): Promise<UserProfile | null> {
  const response = await fetch(`${API_URL}?auth0Id=${auth0Id}`);
  if (!response.ok) return null;
  const user = await response.json();
  
  return {
    auth0Id: user.auth0Id,
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    phone: user.phone || undefined,
    birthDate: user.birthDate || undefined,
    role: user.role as any,
    createdAt: user.createdAt || new Date().toISOString()
  };
}

export const getUserById = getAuth0UserById;

/**
 * Actualiza los datos de un usuario en PostgreSQL via API.
 * @param auth0Id - El Auth0 ID del usuario.
 * @param updates - Objeto con los campos a actualizar.
 */
export async function updateUserData(auth0Id: string, updates: Partial<UserProfile>) {
  const response = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ auth0Id, ...updates })
  });
  if (!response.ok) throw new Error('Error al actualizar usuario');
  return response.json();
}

    console.error("[userModel] Error actualizando usuario:", err);
    throw err;
  }
}

/**
 * Elimina los datos de un usuario de PostgreSQL.
 * @param auth0Id - El Auth0 ID del usuario.
 */
export async function deleteUserData(auth0Id: string) {
  try {
    await db.delete(users).where(eq(users.auth0Id, auth0Id));
  } catch (err: any) {
    console.error("[userModel] Error eliminando usuario:", err);
    throw err;
  }
}
