import z from "zod";
import type { DefinitionId } from "../../domain/definition.js";

export const definitionIdSchema = z.string().transform((id) => id as DefinitionId);

export const definition_schema = z.union([
  z.object({
    id: definitionIdSchema,
    name: z.string(),
    description: z.string().optional(),
    type: z.enum(["string", "number", "boolean"]),
  }),

  z.object({
    id: definitionIdSchema,
    name: z.string(),
    description: z.string().optional(),
    definitions: z.array(definitionIdSchema),
  }),
]);