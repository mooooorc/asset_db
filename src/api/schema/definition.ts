import z from "zod";
import type { DefinitionId } from "../../domain/definition.js";
import { typeIdSchema } from "./type.js";

export const definitionIdSchema = z.string().transform((id) => id as DefinitionId);

export const definition_schema = z.union([
  z.object({
    id: definitionIdSchema,
    name: z.string(),
    description: z.string().optional(),
    type: typeIdSchema,
  }),

  z.object({
    id: definitionIdSchema,
    name: z.string(),
    description: z.string().optional(),
    definitions: z.array(definitionIdSchema),
  }),
]);