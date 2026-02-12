import { Hono } from "hono";
import { auth } from "./lib/auth";
import { cors } from "hono/cors";
import { usersRoute } from "./routes/users/users.route";
import { organizationsRoute } from "./routes/organizations/organizations.route";
import { petsRoute } from "./routes/pets/pets.route";
import { adoptersRoute } from "./routes/adopters/adopters.route";
import { tasksRoute } from "./routes/tasks/tasks.route";
import { imagesRoute } from "./routes/images/images.route";
import { websitesRoute } from "./routes/websites/websites.route";
import { publicRoute } from "./routes/public/public.route";
import { notesRoute } from "./routes/notes/notes.route";
import { filesRoute } from "./routes/files/files.route";
import { vaccinesRoute } from "./routes/vaccines/vaccines.route";
import { proceduresRoute } from "./routes/procedures/procedures.route";
import { medicalRoute } from "./routes/medical/medical.route";
import { permissionsRoute } from "./routes/permissions/permissions.route";
import { invitationsRoute } from "./routes/invitations/invitations.route";

export type Variables = {
  userId: string;
  orgId: number;
  lang: "es" | "en";
};

const app = new Hono<{ Variables: Variables }>()

  .use(
    "*",
    cors({
      origin: [process.env.APP_ORIGIN!, process.env.PUBLIC_ORIGIN!],
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
  .route("/images", imagesRoute)
  .route("/adopters", adoptersRoute)
  .route("/tasks", tasksRoute)
  .route("/vaccines", vaccinesRoute)
  .route("/procedures", proceduresRoute)
  .route("/users", usersRoute)
  .route("/organizations", organizationsRoute)
  .route("/websites", websitesRoute)
  .route("/public", publicRoute)
  .route("/notes", notesRoute)
  .route("/files", filesRoute)
  .route("/medical", medicalRoute)
  .route("/permissions", permissionsRoute)
  .route("/invitations", invitationsRoute);

export default app;

export type AppType = typeof app;
