import z from "zod";
import type { PackageId, PackageTag } from "./package.domain.js";
import { definition_tag_schema, definitionIdSchema } from "../definition/definition.schema.js";
import { asset_id_schema } from "../asset/asset.schema.js";
import { instanceIdSchema } from "../instance/instance.schema.js";


export const packageIdSchema = z.uuid().transform((id) => id as PackageId);

export const package_tag_schema = z.string().transform(
  (tag) => tag as PackageTag
);

export const package_schema = z.object({
  tag: package_tag_schema,
  name: z.string(),
  conditions: z
    .array(
      z.object({
        definition: definition_tag_schema,
        operator: z.enum([
          "equal",
          "different",
          "greater",
          "lower",
          "contains",
        ]),
        value: z.unknown(),
      }),
    )
    .optional(),
});

