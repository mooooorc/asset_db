import { z } from "zod";
import type { UserId } from "./user.domain.js";

export const userIdSchema = z.string().transform((id) => id as UserId);

export const user_schema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});