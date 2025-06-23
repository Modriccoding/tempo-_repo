import { AuthenticateOptions } from "passport";
import { Profile } from "passport";
import { Strategy as PassportStrategy } from "passport";
import { Request } from "express";

declare module "passport-spotify" {
  export interface SpotifyAuthenticateOptions extends AuthenticateOptions {
    scope?: string[];
    showDialog?: boolean;
  }

  export interface SpotifyProfile {
    id: string;
    displayName: string;
    emails?: { value: string }[];
    photos?: string[];
    country?: string;
    provider: "spotify";
  }

  interface Profile extends Profile {
    provider: string;
    id: string;
    username: string;
    displayName: string;
    emails?: { value: string; type?: string }[];
    photos?: { value: string }[];
    country?: string;
    followers?: number;
    product?: string;
    _raw: string;
    _json: any;
  }

  interface StrategyOption {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
    showDialog?: boolean;
  }

  interface StrategyOptionWithRequest extends StrategyOption {
    passReqToCallback: true;
  }

  type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    expires_in: number,
    profile: Profile,
    done: (error: any, user?: any) => void
  ) => void;

  type VerifyFunctionWithRequest = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    expires_in: number,
    profile: Profile,
    done: (error: any, user?: any) => void
  ) => void;

  class Strategy extends PassportStrategy {
    constructor(options: StrategyOption, verify: VerifyFunction);
    constructor(
      options: StrategyOptionWithRequest,
      verify: VerifyFunctionWithRequest
    );
    name: string;
    authenticate(req: Request, options?: object): void;
  }
}

declare global {
  namespace Express {
    interface User {
      id: string;
      displayName: string;
      email?: string;
      accessToken: string;
      refreshToken: string;
    }
  }
}
