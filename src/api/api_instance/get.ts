import type { IncomingMessage, ServerResponse } from "node:http";
import { db_instance } from "../../db/db_instance/main.js";
import type { AssetId } from "../../domain/asset.js";
import type { InstanceId } from "../../domain/instance.js";

export const get_api_instance = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (!req.url) return;

  const parts = req.url.split("/");
  const type = parts[2];
  const assetDbId = parts[3];

  const instance = await db_instance.get(
    type as AssetId,
    assetDbId as InstanceId,
  );

  if (!instance) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Instance not found",
      }),
    );
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(instance));
  return;
};
