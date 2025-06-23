import "express-session";

declare module "express-session" {
  interface SessionData {
    spotifyState?: string;
    passport?: any;
  }
}
