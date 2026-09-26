import type { IncomingMessage, ServerResponse } from "node:http";
import { db_instance } from "../../db/db_instance/main.js";
import type { AssetId } from "../../domain/asset.js";

export const get_all_api_instances = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {

    if(!req.url) return;
    
  const type = req.url.split("/")[2];

  const instances = await db_instance.getAll(type as AssetId);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(instances));
  return;
};
