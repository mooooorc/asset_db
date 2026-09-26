import type { IncomingMessage, ServerResponse } from "node:http";
import { asset_schema } from "../schema/schema.js";
import { db_asset } from "../../db/db_asset/main.js";

export const post_api_asset = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
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
};
