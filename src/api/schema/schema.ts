import z from "zod";
import type { AssetId } from "../../domain/asset.js";
import type { DefinitionId } from "../../domain/definition.js";
import type { PackageId } from "../../domain/package.js";
import type { InstanceId } from "../../domain/instance.js";

const assetIdSchema = z.string().transform((id) => id as AssetId);

const definitionIdSchema = z.string().transform(
  (id) => id as DefinitionId,
);

const packageIdSchema = z.string().transform((id) => id as PackageId)

const instanceIdSchema = z.string().transform((id) => id as InstanceId)

export const instance_schema = z.object({
  type: assetIdSchema,
  properties: z.record(z.string(), z.unknown()),
});

export const asset_schema = z.object({
  id: assetIdSchema,
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

export const package_schema = z.object({
  id: packageIdSchema,
  name: z.string(),
  condition: z.object({
    definition: definitionIdSchema,
    value: z.unknown()
  }).optional()
});

export const package_instance_schema = z.object({
  assetId: assetIdSchema,
  instanceId: instanceIdSchema,
});