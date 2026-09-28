import type { IncomingMessage, ServerResponse } from "node:http";

import type { ConsumerId } from "../../domain/consumer.js";
import { db_consumer } from "../../db/db_consumer/main.js";

export const delete_api_consumer = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (!req.url) return;

  const id = req.url.split("/")[2];

  const consumer = await db_consumer.get(id as ConsumerId);

  if (!consumer) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Consumer not found",
      }),
    );
    return;
  }

  await db_consumer.delete(id as ConsumerId);

  res.statusCode = 204;
  res.end();
};