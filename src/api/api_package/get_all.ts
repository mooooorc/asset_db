import type { IncomingMessage, ServerResponse } from "node:http";
import { db_package } from "../../db/db_package/main.js";

export const get_all_api_packages = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const packages = await db_package.getAll();

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(packages));
  return;
};
