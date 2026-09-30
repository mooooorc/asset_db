import z from "zod";
import type { PackageId } from "./package.domain.js";
import { definitionIdSchema } from "../definition/definition.schema.js";
import { assetIdSchema } from "../asset/asset.schema.js";
import { instanceIdSchema } from "../instance/instance.schema.js";


export const packageIdSchema = z.string().transform((id) => id as PackageId);

export const package_schema = z.object({
  id: packageIdSchema,
  name: z.string(),
  conditions: z
    .array(
      z.object({
        definition: definitionIdSchema,
        operator: z.enum(["equal", "different", "greater", "lower", "contains"]),
        value: z.unknown(),
      }),
    )
    .optional(),
});

export const package_instance_schema = z.object({
  assetId: assetIdSchema,
  instanceId: instanceIdSchema,
});