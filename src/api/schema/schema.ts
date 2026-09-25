import z from "zod";
import type { AssetId } from "../../domain/asset.js";
import type { InstanceId } from "../../domain/instance.js";
import type { DefinitionId } from "../../domain/definition.js";

const assetIdSchema = z.string().transform((id) => id as AssetId);

const instanceIdSchema = z.string().transform((id) => id as InstanceId);

const definitionIdSchema = z.string().transform(
  (id) => id as DefinitionId,
);

export const instance_schema = z.object({
  asset_db_id: instanceIdSchema,
  type: assetIdSchema,
  properties: z.record(z.string(), z.unknown()),
});

export const asset_schema = z.object({
  name: z.string(),
  definitions: z.array(definitionIdSchema),
});

export const definition_schema = z.union([
  z.object({
    id: definitionIdSchema,
    name: z.string(),
    valueType: z.enum(["string", "number", "boolean"]),
  }),

  z.object({
    id: definitionIdSchema,
    name: z.string(),
    definitions: z.array(definitionIdSchema),
  }),
]);