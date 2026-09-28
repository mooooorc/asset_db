import type { IncomingMessage, ServerResponse } from "node:http";
import { consumer_schema } from "../schema/schema.js";
import { db_consumer } from "../../db/db_consumer/main.js";


export const post_api_consumer = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const body = JSON.parse(Buffer.concat(chunks).toString());

  const result = consumer_schema.safeParse(body);

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Invalid consumer",
      }),
    );
    return;
  }

  try {
    const saved = await db_consumer.save(result.data);

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(saved));
  } catch (error) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }
};