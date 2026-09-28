import type { IncomingMessage, ServerResponse } from "node:http";

import { db_consumer } from "../../db/db_consumer/main.js";

export const get_all_api_consumers = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const consumers = await db_consumer.getAll();

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(consumers));
};