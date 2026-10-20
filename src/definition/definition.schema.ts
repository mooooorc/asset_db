import z from "zod";
import type { DefinitionId, DefinitionTag } from "./definition.domain.js";


export const definitionIdSchema = z.uuid().transform((id) => id as DefinitionId);

export const definition_tag_schema = z.string().transform((tag) => tag as DefinitionTag)

export const definition_schema = z.union([
  z.object({
    tag: definition_tag_schema,
    name: z.string(),
    description: z.string().optional(),
    type: z.enum(["string", "number", "boolean", "relation"]),
  }),

  z.object({
    tag: definition_tag_schema,
    name: z.string(),
    description: z.string().optional(),
    definitions: z.array(definition_tag_schema),
    type: z.literal("composite")
  }),
]);