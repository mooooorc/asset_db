import type { IncomingMessage, ServerResponse } from "node:http";
import { package_schema } from "../schema/schema.js";
import type { Package } from "../../domain/package.js";
import { db_package } from "../../db/db_package/main.js";

export const post_api_package = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const body = JSON.parse(Buffer.concat(chunks).toString());

  const result = package_schema.safeParse(body);

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Invalid package",
      }),
    );
    return;
  }

  try {
    const pck: Package = {
      id: result.data.id,
      name: result.data.name,
      ...(result.data.condition
        ? {
            condition: result.data.condition,
          }
        : {}),
    };

    const saved = await db_package.save(pck);

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(saved));
  } catch (error) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Invalid package",
      }),
    );
  }

  return;
};
