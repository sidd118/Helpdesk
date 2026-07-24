import express from "express";
import { toNodeHandler } from "better-auth/node";
import { prisma } from "./db";
import { auth } from "./auth";
import { requireAuth } from "./middleware/requireAuth";

const app = express();
const port = process.env.PORT ?? 4000;

// Mounted before express.json() — Better Auth needs the raw request body.
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/db-health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "okk" });
  } catch (error) {
    res.status(500).json({ status: "error", message: (error as Error).message });
  }
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: req.user, session: req.session });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
