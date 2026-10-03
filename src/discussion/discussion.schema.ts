import { z } from "zod";
import { consumerIdSchema } from "../consumer/consumer.schema.js";

export const discussion_schema = z.object({
  package: z.string().min(1),
  title: z.string().min(1),
  consumer: consumerIdSchema.optional()
});

