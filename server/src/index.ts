import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import https from "https";
import fs from "fs";
import path from "path";
import { config } from "./config";
import passport from "./config/passport";
import { setSessionStore } from "./config/passport";
import { authRouter } from "./routes/auth";
import { spotifyRouter } from "./routes/spotify";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ["https://tempo.local:5174"],
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.session.secret));

// Store de session en mémoire avec TTL
const sessionStore = new session.MemoryStore();
setSessionStore(sessionStore);

// Configuration Session - DOIT être avant Passport
app.use(
  session({
    store: sessionStore,
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: "/",
      domain: "tempo.local",
    },
  })
);

// Initialisation Passport - DOIT être après la session
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour gérer les sessions
app.use((req, res, next) => {
  // Force le protocole HTTPS
  if (req.headers["x-forwarded-proto"] !== "https") {
    req.headers["x-forwarded-proto"] = "https";
  }

  // Assure que le cookie de session est envoyé
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Debug détaillé
  console.log("\n=== DEBUG DÉTAILLÉ ===");
  console.log("URL appelée:", req.url);
  console.log("Host:", req.get("host"));
  console.log("Protocol:", req.protocol);
  console.log("Secure:", req.secure);
  console.log("Headers:", {
    origin: req.get("origin"),
    referer: req.get("referer"),
    cookie: req.get("cookie"),
  });
  console.log("Session ID:", req.sessionID);
  console.log("Session:", req.session);
  if (req.user) {
    console.log("User:", {
      id: req.user.id,
      displayName: req.user.displayName,
    });
  }

  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Tempo API is running" });
});

// Routes d'authentification - DOIVENT être après Passport
app.use("/auth", authRouter);
app.use("/spotify", spotifyRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
);

// Certificats SSL
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "../ssl/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../ssl/cert.pem")),
};

// Création du serveur HTTPS
const server = https.createServer(sslOptions, app);

// Démarrage du serveur sur toutes les interfaces
server.listen(config.port, () => {
  console.log(`Server is running on https://tempo.local:${config.port}`);
  console.log("Spotify config:", {
    clientId: config.spotify.clientId ? "Set" : "Not set",
    clientSecret: config.spotify.clientSecret ? "Set" : "Not set",
    redirectUri: config.spotify.redirectUri,
  });
});

// Handle server errors
server.on("error", (error: any) => {
  console.error("Server error:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
