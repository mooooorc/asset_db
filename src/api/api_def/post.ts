import type { IncomingMessage, ServerResponse } from "node:http";
import { definition_schema } from "../schema/schema.js";
import { db_definition } from "../../db/db_def/main.js";

export const post_api_def = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const body = JSON.parse(Buffer.concat(chunks).toString());

  const result = definition_schema.safeParse(body);

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Invalid definition",
      }),
    );
    return;
  }

  try {
    const definition = await db_definition.save(result.data);

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(definition));
  } catch (error) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Invalid definition",
      }),
    );
  }

  return;
};
