import z from "zod";
import { assetIdSchema } from "./asset.js";
import type { InstanceId } from "../../domain/instance.js";

export const instanceIdSchema = z.string().transform((id) => id as InstanceId);

export const instance_schema = z.object({
  type: assetIdSchema,
  properties: z.record(z.string(), z.unknown()),
});
