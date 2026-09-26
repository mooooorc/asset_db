import type { ServerResponse } from "node:http";
import { db_definition } from "../../db/db_def/main.js";

export const get_all_api_defs = async (
  res: ServerResponse,
) => {
  const definitions = await db_definition.getAll();

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(definitions));
  return;
};
