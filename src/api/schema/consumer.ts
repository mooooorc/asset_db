import z from "zod";
import type { ConsumerId } from "../../domain/consumer.js";


const consumerIdSchema = z.string().transform((id) => id as ConsumerId);

export const consumer_schema = z.object({
  id: consumerIdSchema,
  name: z.string(),
});