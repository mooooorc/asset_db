import z from "zod";
import type { TypeId } from "../../domain/type.js";

export const typeIdSchema = z.string().transform((id) => id as TypeId);


export const type_schema = z.object({
  id: typeIdSchema,
  name: z.string(),
  baseType: z.enum(["string", "number", "boolean"]),
});