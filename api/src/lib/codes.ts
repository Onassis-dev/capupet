import { randomBytes } from "crypto";

export function generateCode() {
  return randomBytes(12).toString("base64url");
}
