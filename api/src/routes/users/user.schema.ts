import { z } from "zod/v4";

export const updateOrgSchema = z.object({
  orgId: z.number().int(),
});

export const updateUserSchema = z.object({
  name: z.string(),
  lang: z.string(),
});

export const acceptInvitationSchema = z.object({
  invitation: z.string(),
});
