import z from "zod";
import type { AssetId } from "../../domain/asset.js";
import { definitionIdSchema } from "./definition.js";

export const assetIdSchema = z.string().transform((id) => id as AssetId);

export const asset_definition_schema = z.object({
  definition: definitionIdSchema,
  required: z.literal(true).optional(),
  identifiable: z.literal(true).optional()
});

export const asset_schema = z.object({
  id: assetIdSchema,
  name: z.string(),
  definitions: z.array(asset_definition_schema),
  exposeAsPackage: z.literal(true).optional(),
});