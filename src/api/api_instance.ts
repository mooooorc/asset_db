import type { IncomingMessage, ServerResponse } from "node:http";
import { db_instance } from "../db/db_instance.js";
import type { AssetId } from "../domain/asset.js";
import type { InstanceId } from "../domain/instance.js";
import { instance_schema } from "./schema/schema.js";


export const api_instance = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (req.method === "POST" && req.url === "/instances") {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const body = JSON.parse(Buffer.concat(chunks).toString());

  const result = instance_schema.safeParse(body);

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Invalid instance",
      }),
    );
    return;
  }

  try {
    const instance = await db_instance.save(result.data);

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(instance));
  } catch (error) {
  res.statusCode = 400;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      error: error instanceof Error ? error.message : String(error),
    }),
  );
}

  return;
}

  if (
  req.method === "GET" &&
  req.url?.startsWith("/instances/") &&
  req.url.split("/").length === 3
) {
  const type = req.url.split("/")[2];

  const instances = await db_instance.getAll(type as AssetId);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(instances));
  return;
}

  if (req.method === "GET" && req.url?.startsWith("/instances/")) {
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
  }

  if (req.method === "DELETE" && req.url?.startsWith("/instances/")) {
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

    try {
      await db_instance.delete(type as AssetId, assetDbId as InstanceId);

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
  }
};
