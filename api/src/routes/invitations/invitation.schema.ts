import { z } from "zod/v4";

export const getInvitationSchema = z.object({
  id: z.string(),
});
