import type { IncomingMessage, ServerResponse } from "node:http";

import { db_type } from "../../db/db_type/main.js";

export const get_all_api_types = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const types = await db_type.getAll();

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(types));
};