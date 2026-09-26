import type { IncomingMessage, ServerResponse } from "node:http";
import { db_asset } from "../../db/db_asset/main.js";
import type { AssetId } from "../../domain/asset.js";

export const get_api_asset = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (!req.url) return;

  const id = req.url.split("/")[2];

  const asset = await db_asset.get(id as AssetId);

  if (!asset) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Asset not found",
      }),
    );
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(asset));
  return;
};
