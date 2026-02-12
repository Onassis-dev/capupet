import { type Context } from "hono";
export type ErrorCode = 400 | 401 | 403 | 404 | 500;

const errorList = {
  noOrg: {
    es: "No tienes una organización asignada",
    en: "You don't have an organization assigned",
  },
  unauthorized: {
    es: "No tienes permisos para acceder a este recurso",
    en: "You are not authorized to access this resource",
  },
  nameTaken: {
    es: "El nombre de la organización ya existe",
    en: "The organization name already exists",
  },
  noAvailableOrg: {
    es: "No tienes una organización disponible",
    en: "You don't have an available organization",
  },
  confirmEmail: {
    es: "Por favor, confirma tu email para continuar",
    en: "Please confirm your email to continue",
  },
  existingDependencies: {
    es: "Para eliminar el registro, primero debe eliminar los registros asociados",
    en: "To delete the record, you must first delete the associated records",
  },
  invalidInvitation: {
    es: "Invitación inválida",
    en: "Invalid invitation",
  },
  cannotDeleteOwner: {
    es: "No puedes eliminar el dueño de la organización",
    en: "You cannot delete the owner of the organization",
  },
  cannotDeleteSelf: {
    es: "No puedes eliminar tu propio usuario",
    en: "You cannot delete your own permission",
  },
  cannotEditOwner: {
    es: "No puedes editar el dueño de la organización",
    en: "You cannot edit the owner of the organization",
  },
  cannotEditSelf: {
    es: "No puedes editar tu propio usuario",
    en: "You cannot edit your own permission",
  },
} as const;

export function sendError(
  c: Context,
  message: keyof typeof errorList | null,
  code: ErrorCode = 400,
  errorCode: string = ""
) {
  if (!message) return c.json({ error: errorCode, message: "" }, code);

  let lang = c.get("lang");
  if (lang !== "es" && lang !== "en") lang = "en";
  return c.json(
    {
      error: errorCode,
      message:
        errorList[message][lang as keyof (typeof errorList)[typeof message]],
    },
    code
  );
}
