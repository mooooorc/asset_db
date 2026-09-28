import z from "zod";
import type { TypeId } from "../../domain/type.js";

export const typeIdSchema = z.string().transform((id) => id as TypeId);


export const type_schema = z
  .object({
    id: typeIdSchema,
    name: z.string(),
    baseType: z.enum(["string", "number", "boolean"]),
    default: z.union([z.string(), z.number(), z.boolean()]).optional(),
  })
  .superRefine((type, context) => {
    if (type.default === undefined) {
      return;
    }

    const validDefault =
      (type.baseType === "string" && typeof type.default === "string") ||
      (type.baseType === "number" && typeof type.default === "number") ||
      (type.baseType === "boolean" && typeof type.default === "boolean");

    if (!validDefault) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Default value must be a ${type.baseType}`,
        path: ["default"],
      });
    }
  });