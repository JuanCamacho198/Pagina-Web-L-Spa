import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { db, accountLockouts, eq } from '@l-spa/database';
import { nanoid } from 'nanoid';
import type { LockoutRecord } from '@l-spa/shared-types';

type Database = typeof db;

@Injectable()
export class LockoutService {
  constructor(@Inject('DRIZZLE_CONNECTION') private readonly db: Database) {}

  async lockAccount(userId: string, lockoutDurationMs: number = 900000): Promise<LockoutRecord> {
    const expiresAt = new Date(Date.now() + lockoutDurationMs);
    
    const existingLockout = await this.db.select()
      .from(accountLockouts)
      .where(eq(accountLockouts.userId, userId))
      .limit(1);

    const activeExisting = existingLockout.find(l => new Date(l.expiresAt) > new Date());
    if (activeExisting) {
      return {
        id: activeExisting.id,
        userId: activeExisting.userId,
        lockedAt: activeExisting.lockedAt,
        expiresAt: activeExisting.expiresAt,
        lockedBy: activeExisting.lockedBy ?? 'system',
      };
    }

    const [result] = await this.db.insert(accountLockouts)
      .values({
        id: nanoid(),
        userId,
        expiresAt,
        lockedBy: 'system',
      })
      .returning();

    return {
      id: result.id,
      userId: result.userId,
      lockedAt: result.lockedAt,
      expiresAt: result.expiresAt,
      lockedBy: result.lockedBy ?? 'system',
    };
  }

  async checkLockout(userId: string): Promise<LockoutRecord | null> {
    const [lockout] = await this.db.select()
      .from(accountLockouts)
      .where(eq(accountLockouts.userId, userId))
      .limit(1);

    if (!lockout) {
      return null;
    }

    if (new Date(lockout.expiresAt) <= new Date()) {
      return null;
    }

    return {
      id: lockout.id,
      userId: lockout.userId,
      lockedAt: lockout.lockedAt,
      expiresAt: lockout.expiresAt,
      lockedBy: lockout.lockedBy ?? 'system',
    };
  }

  async unlockAccount(userId: string): Promise<boolean> {
    const result = await this.db.delete(accountLockouts)
      .where(eq(accountLockouts.userId, userId));
    
    return (result.rowCount ?? 0) > 0;
  }

  async getActiveLockouts(): Promise<LockoutRecord[]> {
    const lockouts = await this.db.select()
      .from(accountLockouts);
    
    return lockouts
      .filter(l => new Date(l.expiresAt) > new Date())
      .map(lockout => ({
        id: lockout.id,
        userId: lockout.userId,
        lockedAt: lockout.lockedAt,
        expiresAt: lockout.expiresAt,
        lockedBy: lockout.lockedBy ?? 'system',
      }));
  }
}
