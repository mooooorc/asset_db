import type { IncomingMessage, ServerResponse } from "node:http";
import { package_instance_schema } from "../schema/schema.js";
import { db_package } from "../../db/db_package/main.js";
import type { PackageId } from "../../domain/package.js";

export const post_api_package_instance = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (!req.url) return;
  const parts = req.url.split("/");
  const packageId = parts[2];

  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const body = JSON.parse(Buffer.concat(chunks).toString());

  const result = package_instance_schema.safeParse(body);

  if (!result.success) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Invalid package instance",
      }),
    );
    return;
  }

  try {
    await db_package.addInstance(packageId as PackageId, result.data);

    res.statusCode = 201;
    res.end();
  } catch (error) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Unable to add instance to package",
      }),
    );
  }

  return;
};
