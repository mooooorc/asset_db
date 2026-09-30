import z from "zod";


import { assetIdSchema } from "../asset/asset.schema.js";
import type { InstanceId } from "./instance.domain.js";

export const instanceIdSchema = z.string().transform((id) => id as InstanceId);

export const instance_schema = z.object({
  type: assetIdSchema,
  properties: z.record(z.string(), z.unknown()),
});
