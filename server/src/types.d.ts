// Augments express-session with the fields we actually store,
// and express's Request with the resolved user set by auth.middleware.

import { Role } from '@prisma/client';

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};
