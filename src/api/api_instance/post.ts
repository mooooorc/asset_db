import type { IncomingMessage, ServerResponse } from "node:http";
import { instance_schema } from "../schema/schema.js";
import { db_instance } from "../../db/db_instance/main.js";

export const post_api_instance = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const body = JSON.parse(Buffer.concat(chunks).toString());

  const result = instance_schema.safeParse(body);

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Invalid instance",
      }),
    );
    return;
  }

  try {
    const instance = await db_instance.save(result.data);

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(instance));
  } catch (error) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }

  return;
};
