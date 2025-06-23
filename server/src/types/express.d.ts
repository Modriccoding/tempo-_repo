import "express";
import "express-session";

declare module "express-session" {
  interface SessionData {
    user: {
      id: string;
      displayName: string;
      email?: string;
      accessToken: string;
      refreshToken: string;
    };
  }
}

declare module "express" {
  interface Request {
    user?: {
      id: string;
      displayName: string;
      email?: string;
      accessToken: string;
      refreshToken: string;
    };
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        accessToken: string;
        refreshToken?: string;
      };
    }
  }
}

declare namespace Express {
  export interface User {
    id: string;
    displayName: string;
    email?: string;
    accessToken: string;
    refreshToken: string;
  }
}
