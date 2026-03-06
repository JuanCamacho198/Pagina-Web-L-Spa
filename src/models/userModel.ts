// src/models/userModel.ts
import { db, users } from "../db";
import { eq } from "drizzle-orm";
import { UserProfile } from "../types";

/**
 * Guarda (o crea) un perfil de usuario en la base de datos Postgres.
 * @param uid - El UID único proveído por Firebase Auth
 * @param nombre - Nombre del usuario
 * @param apellido - Apellido del usuario
 * @param correo - Email del usuario
 */
export async function saveUserData(uid: string, nombre: string, apellido: string, correo: string) {
  console.log("[userModel] ⇢ saveUserData llamado con:", {
    uid, nombre, apellido, correo
  });
  
  try {
    const result = await db.insert(users).values({
      firebaseUid: uid,
      nombre,
      apellido,
      email: correo,
      // Nota: No guardamos la contraseña en Postgres por seguridad, 
      // ya que Firebase Auth se encarga de ello en sus propios servidores.
    }).returning();
    
    console.log("[userModel] ✔ Insert exitoso para UID:", uid);
    return result[0];
  } catch (err: any) {
    console.error("[userModel] ✖ error en insert para UID:", uid, err);
    throw err;
  }
}

/**
 * Trae un perfil de usuario por su Firebase UID.
 * @param uid - El UID de Firebase.
 * @returns El perfil de usuario mapeado.
 */
export async function getUserById(uid: string): Promise<UserProfile | null> {
  try {
    const result = await db.select()
      .from(users)
      .where(eq(users.firebaseUid, uid))
      .limit(1);
      
    if (result.length === 0) return null;
    
    const user = result[0];
    return {
      uid: user.firebaseUid,
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono || undefined,
      fechaNacimiento: user.fechaNacimiento || undefined
    };
  } catch (err: any) {
    console.error("[userModel] Error bajando datos del usuario:", err);
    throw err;
  }
}
/**
 * Actualiza los datos de un usuario en PostgreSQL.
 * @param uid - El Firebase UID del usuario.
 * @param updates - Objeto con los campos a actualizar.
 */
export async function updateUserData(uid: string, updates: Partial<UserProfile>) {
  try {
    const result = await db.update(users)
      .set({
        nombre: updates.nombre,
        apellido: updates.apellido,
        email: updates.email,
        telefono: updates.telefono,
        fechaNacimiento: updates.fechaNacimiento
      })
      .where(eq(users.firebaseUid, uid))
      .returning();
    return result[0];
  } catch (err: any) {
    console.error("[userModel] Error actualizando usuario:", err);
    throw err;
  }
}

/**
 * Elimina los datos de un usuario de PostgreSQL.
 * @param uid - El Firebase UID del usuario.
 */
export async function deleteUserData(uid: string) {
  try {
    await db.delete(users).where(eq(users.firebaseUid, uid));
  } catch (err: any) {
    console.error("[userModel] Error eliminando usuario:", err);
    throw err;
  }
}