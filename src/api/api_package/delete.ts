import type { IncomingMessage, ServerResponse } from "node:http";
import type { PackageId } from "../../domain/package.js";
import { db_package } from "../../db/db_package/main.js";

export const delete_api_package = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (!req.url) return;

  const id = req.url.split("/")[2] as PackageId;

  await db_package.delete(id);

  res.statusCode = 204;
  res.end();
};
