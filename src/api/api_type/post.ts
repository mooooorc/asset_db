import type { IncomingMessage, ServerResponse } from "node:http";

import type { Type } from "../../domain/type.js";
import { db_type } from "../../db/db_type/main.js";
import { type_schema } from "../schema/type.js";

export const post_api_type = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const body = JSON.parse(Buffer.concat(chunks).toString());

  const result = type_schema.safeParse(body);

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Invalid type",
      }),
    );
    return;
  }

  try {
    const type: Type = {
      id: result.data.id,
      name: result.data.name,
      baseType: result.data.baseType,
      ...(result.data.default !== undefined
        ? {
            default: result.data.default,
          }
        : {}),
    };

    const saved = await db_type.save(type);

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(saved));
  } catch (error) {
    console.error(error)
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Invalid type",
      }),
    );
  }

  return;
};