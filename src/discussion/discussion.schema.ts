import { z } from "zod";

export const discussion_schema = z.object({
  package: z.string().min(1),
  title: z.string().min(1),
});