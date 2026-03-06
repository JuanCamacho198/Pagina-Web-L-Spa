// src/models/userModel.ts
import { db, users } from "../db";
import { eq } from "drizzle-orm";
import { UserProfile } from "../types";

/**
 * Guarda (o crea) un perfil de usuario en la base de datos Postgres.
 * @param auth0Id - El ID único proveído por Auth0
 * @param nombre - Nombre del usuario
 * @param apellido - Apellido del usuario
 * @param correo - Email del usuario
 */
export async function saveUserData(auth0Id: string, nombre: string, apellido: string, correo: string) {
  console.log("[userModel] ⇢ saveUserData llamado con:", {
    auth0Id, nombre, apellido, correo
  });
  
  try {
    const result = await db.insert(users).values({
      auth0Id: auth0Id,
      nombre,
      apellido,
      email: correo,
    }).returning();
    
    console.log("[userModel] ✔ Insert exitoso para ID Auth0:", auth0Id);
    return result[0];
  } catch (err: any) {
    console.error("[userModel] ✖ error en insert para ID Auth0:", auth0Id, err);
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
    nombre: user.nombre || '',
    apellido: user.apellido || '',
    email: user.email,
    telefono: user.telefono || undefined,
    fechaNacimiento: user.fechaNacimiento || undefined,
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
        nombre: updates.nombre,
        apellido: updates.apellido,
        email: updates.email,
        telefono: updates.telefono,
        fechaNacimiento: updates.fechaNacimiento
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
