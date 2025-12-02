import { Hono } from "hono";
import { auth } from "./lib/auth";
import { cors } from "hono/cors";
import { usersRoute } from "./routes/users/users.route";
import { organizationsRoute } from "./routes/organizations/organizations.route";
import { petsRoute } from "./routes/pets/pets.route";
import { adoptersRoute } from "./routes/adopters/adopters.route";
import { tasksRoute } from "./routes/tasks/tasks.route";

export type Variables = {
  userId: string;
  orgId: number;
  lang: "es" | "en";
};

const app = new Hono<{ Variables: Variables }>()

  .use(
    "*",
    cors({
      origin: [process.env.APP_ORIGIN!],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
      exposeHeaders: ["Content-Length", "X-ORG"],
      maxAge: 600,
      credentials: true,
    })
  )
  .get("/health", (c) => c.text("ok"))

  .on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw))

  .route("/pets", petsRoute)
  .route("/adopters", adoptersRoute)
  .route("/tasks", tasksRoute)
  .route("/users", usersRoute)
  .route("/organizations", organizationsRoute);

export default app;

export type AppType = typeof app;
