// src/models/userModel.ts
import { db, users } from "../db";
import { eq } from "drizzle-orm";
import { UserProfile } from "../types";

/**
 * Guarda (o crea) un perfil de usuario en la base de datos Postgres.
 * @param userData - Objeto con los datos del usuario.
 */
export async function saveUserData(userData: {
  auth0Id: string;
  email: string;
  name: string;
  role?: 'admin' | 'employee' | 'customer';
}) {
  console.log("[userModel] ⇢ saveUserData llamado con:", userData);
  
  try {
    const result = await db.insert(users).values({
      auth0Id: userData.auth0Id,
      firstName: userData.name,
      email: userData.email,
      role: userData.role || 'customer',
    }).onConflictDoUpdate({
      target: users.auth0Id,
      set: {
        firstName: userData.name,
      }
    }).returning();
    
    console.log("[userModel] ✔ Sync exitoso para ID Auth0:", userData.auth0Id);
    return result[0];
  } catch (err: any) {
    console.error("[userModel] ✖ error en sync para ID Auth0:", userData.auth0Id, err);
    throw err;
  }
}

/**
 * Trae un perfil de usuario por su Auth0 ID.
 * @param auth0Id - El ID de Auth0.
 * @returns El perfil de usuario mapeado.
 */
export async function getAuth0UserById(auth0Id: string): Promise<UserProfile | null> {
  const result = await db.select().from(users).where(eq(users.auth0Id, auth0Id)).limit(1);
  if (result.length === 0) return null;
  const user = result[0];
  return {
    uid: user.auth0Id,
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    phone: user.phone || undefined,
    birthDate: user.birthDate || undefined,
    role: user.role as any
  };
}

/**
 * Actualiza los datos de un usuario en PostgreSQL.
 * @param auth0Id - El Auth0 ID del usuario.
 * @param updates - Objeto con los campos a actualizar.
 */
export async function updateUserData(auth0Id: string, updates: Partial<UserProfile>) {
  try {
    const result = await db.update(users)
      .set({
        firstName: updates.firstName,
        lastName: updates.lastName,
        email: updates.email,
        phone: updates.phone,
        birthDate: updates.birthDate
      })
      .where(eq(users.auth0Id, auth0Id))
      .returning();
    return result[0];
  } catch (err: any) {
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
