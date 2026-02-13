import { z } from "zod/v4";
import { type Permission } from "../../db/auth.db";

export const selectPermissionsSchema = z.object({
  name: z.string().nullable(),
  page: z.coerce.number(),
});

export const createPermissionSchema = z.object({
  users: z.boolean(),
  pets: z.boolean(),
  adopters: z.boolean(),
  tasks: z.boolean(),
  website: z.boolean(),
} satisfies Record<Permission, any>);

export const editPermissionSchema = createPermissionSchema.extend({
  id: z.coerce.number(),
});
