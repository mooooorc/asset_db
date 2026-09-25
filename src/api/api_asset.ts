import type { IncomingMessage, ServerResponse } from "node:http";
import { db_asset } from "../db/db_asset.js";
import type { AssetId } from "../domain/asset.js";
import { asset_schema } from "./schema/schema.js";

export const api_asset = async (req: IncomingMessage, res: ServerResponse) => {
  
  if (req.method === "GET" && req.url === "/assets") {
    const assets = await db_asset.getAll();

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(assets));
    return;
  }

  if (req.method === "POST" && req.url === "/assets") {
    const chunks: Buffer[] = [];

    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const body = JSON.parse(Buffer.concat(chunks).toString());

    const result = asset_schema.safeParse(body);

    if (!result.success) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Invalid asset",
        }),
      );
      return;
    }

    try {
      const asset = await db_asset.save(result.data);

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(asset));
    } catch (error) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Invalid asset",
        }),
      );
    }

    return;
  }

  if (req.method === "GET" && req.url?.startsWith("/assets/")) {
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
  }

  if (req.method === "DELETE" && req.url?.startsWith("/assets/")) {
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
  }
};
