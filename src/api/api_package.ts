import type { IncomingMessage, ServerResponse } from "node:http";
import { package_instance_schema, package_schema } from "./schema/schema.js";
import { db_package } from "../db/db_package.js";
import type { PackageId } from "../domain/package.js";



export const api_package = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (req.method === "POST" && req.url === "/packages") {
    const chunks: Buffer[] = [];

    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const body = JSON.parse(Buffer.concat(chunks).toString());

    const result = package_schema.safeParse(body);

    if (!result.success) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Invalid package",
        }),
      );
      return;
    }

    try {
      const pck = await db_package.save(result.data);

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(pck));
    } catch (error) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Invalid package",
        }),
      );
    }

    return;
  }

  if (req.method === "GET" && req.url === "/packages") {
  const packages = await db_package.getAll();

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(packages));
  return;
}

  if (
    req.method === "GET" &&
    req.url?.startsWith("/packages/") &&
    req.url.split("/").length === 3
  ) {
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
  }

  if (
    req.method === "POST" &&
    req.url?.startsWith("/packages/") &&
    req.url.endsWith("/instances")
  ) {
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
      await db_package.addInstance(
        packageId as PackageId,
        result.data,
      );

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
  }

  if (
    req.method === "GET" &&
    req.url?.startsWith("/packages/") &&
    req.url.endsWith("/instances")
  ) {
    const parts = req.url.split("/");
    const packageId = parts[2];

    const instances = await db_package.getInstances(
      packageId as PackageId,
    );

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(instances));
    return;
  }
};