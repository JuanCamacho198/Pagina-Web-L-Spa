import { Injectable, Logger } from '@nestjs/common';
import { db } from '@l-spa/database';
import { auditLog } from '@l-spa/database/schema';

type AuditAction = 
  | 'LOGIN_SUCCESS' 
  | 'LOGIN_FAILED' 
  | 'LOGOUT'
  | 'ROLE_CHANGE' 
  | 'USER_UNLOCK' 
  | 'USER_DELETE' 
  | 'USER_CREATE'
  | 'PASSWORD_CHANGE'
  | 'EMAIL_VERIFICATION';

interface AuditLogParams {
  userId?: string;
  action: AuditAction;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  async log(params: AuditLogParams): Promise<void> {
    const { userId, action, ipAddress, userAgent, success, metadata } = params;
    
    try {
      await db.insert(auditLog).values({
        userId: userId || null,
        action,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        timestamp: new Date(),
        success,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });

      this.logger.log(
        `Audit: ${action} - User: ${userId || 'anonymous'} - Success: ${success}`
      );
    } catch (error) {
      this.logger.error(`Failed to write audit log: ${error}`);
    }
  }
}