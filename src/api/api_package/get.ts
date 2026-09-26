import type { IncomingMessage, ServerResponse } from "node:http";
import { db_package } from "../../db/db_package/main.js";
import type { PackageId } from "../../domain/package.js";

export const get_api_package = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (!req.url) return;

  const id = req.url.split("/")[2];

  const pck = await db_package.get(id as PackageId);

  if (!pck) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Package not found",
      }),
    );
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(pck));
  return;
};
