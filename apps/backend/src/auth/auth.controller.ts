import { Controller, All, Req, Res, Inject } from '@nestjs/common';
import type { Request, Response } from 'express';
import { toNodeHandler } from 'better-auth/node';

@Controller('auth')
export class AuthController {
  constructor(@Inject('AUTH_CLIENT') private readonly auth: any) {}

  @All('*')
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    const handler = toNodeHandler(this.auth);
    return handler(req, res);
  }
}
