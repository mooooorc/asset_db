import type { IncomingMessage, ServerResponse } from "node:http";
import { db_package } from "../../db/db_package/main.js";
import type { PackageId } from "../../domain/package.js";

export const get_api_package_instances = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (!req.url) return;
  const parts = req.url.split("/");
  const packageId = parts[2];

  const instances = await db_package.getInstances(packageId as PackageId);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(instances));
  return;
};
