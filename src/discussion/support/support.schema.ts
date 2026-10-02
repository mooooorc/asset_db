import { z } from "zod";
import { consumerIdSchema } from "../../consumer/consumer.schema.js";

export const support_schema = z.object({
  consumer: consumerIdSchema,
});