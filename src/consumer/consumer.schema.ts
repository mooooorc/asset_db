import z from "zod";
import type { ConsumerId } from "./consumer.domain.js";
import { packageIdSchema } from "../package/package.schema.js";



export const consumerIdSchema = z.string().transform((id) => id as ConsumerId);

export const consumer_schema = z.object({
  id: consumerIdSchema,
  name: z.string(),
  packages: z.array(packageIdSchema),
});