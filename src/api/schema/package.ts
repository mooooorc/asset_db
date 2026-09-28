import z from "zod";
import type { PackageId } from "../../domain/package.js";
import { definitionIdSchema } from "./definition.js";
import { assetIdSchema } from "./asset.js";
import { instanceIdSchema } from "./instance.js";

export const packageIdSchema = z.string().transform((id) => id as PackageId);

export const package_schema = z.object({
  id: packageIdSchema,
  name: z.string(),
  conditions: z
    .array(
      z.object({
        definition: definitionIdSchema,
        operator: z.enum(["equal", "different", "greater", "lower"]),
        value: z.unknown(),
      }),
    )
    .optional(),
});

export const package_instance_schema = z.object({
  assetId: assetIdSchema,
  instanceId: instanceIdSchema,
});