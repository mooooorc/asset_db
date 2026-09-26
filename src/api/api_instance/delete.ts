import type { IncomingMessage, ServerResponse } from "node:http";
import { db_instance } from "../../db/db_instance/main.js";
import type { AssetId } from "../../domain/asset.js";
import type { InstanceId } from "../../domain/instance.js";

export const delete_api_instance = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (!req.url) return;

  const parts = req.url.split("/");
  const type = parts[2];
  const id = parts[3];

  const instance = await db_instance.get(
    type as AssetId,
    id as InstanceId,
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

  try {
    await db_instance.delete(type as AssetId, id as InstanceId);

    res.statusCode = 204;
    res.end();
  } catch (error) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Unable to delete instance",
      }),
    );
  }

  return;
};
