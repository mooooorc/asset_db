import z from "zod";
import { asset_tag_schema } from "../asset/asset.schema.js";
import type { InstanceId } from "./instance.domain.js";

export const instanceIdSchema = z.uuid().transform((id) => id as InstanceId);



export const instance_schema = z.object({
  type: asset_tag_schema,
  properties: z.record(z.string(), z.unknown()),
});