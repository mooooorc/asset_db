import { db_asset } from "../../db/db_asset/main.js";
import type { AssetId } from "../../domain/asset.js";
import type { IncomingMessage, ServerResponse } from "node:http";

export const delete_api_asset = async (
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

  try {
    await db_asset.delete(id as AssetId);

    res.statusCode = 204;
    res.end();
  } catch (error) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Unable to delete asset",
      }),
    );
  }

  return;
};
