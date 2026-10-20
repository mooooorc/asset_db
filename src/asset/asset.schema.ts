import z from "zod";
import {  definition_tag_schema } from "../definition/definition.schema.js";
import type { AssetId, AssetTag } from "./asset.domain.js";


export const asset_id_schema = z.string().transform((id) => id as AssetId);
export const asset_tag_schema = z.string().transform((tag) => tag as AssetTag)

export const asset_definition_schema = z.object({
  tag: definition_tag_schema,
  required: z.literal(true).optional(),
  identifiable: z.literal(true).optional()
});

export const asset_schema = z.object({
  tag: asset_tag_schema,
  name: z.string(),
  definitions: z.array(asset_definition_schema),
  exposeAsPackage: z.literal(true).optional(),
});