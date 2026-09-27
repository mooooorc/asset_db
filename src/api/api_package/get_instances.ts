import type { IncomingMessage, ServerResponse } from "node:http";
import { db_package } from "../../db/db_package/main.js";
import {
  instance_to_package_content,
  type PackageId,
} from "../../domain/package.js";
import { db_instance } from "../../db/db_instance/main.js";

export const get_api_package_instances = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (!req.url) return;

  const parts = req.url.split("/");
  const packageId = parts[2];
  
  const pack = await db_package.get(packageId as PackageId);

    if (!pack) {
    res.statusCode = 404;
    res.end();
    return;
  }

  const instances = await db_package.getInstances(pack.id as PackageId);

  const resolvedInstances = await Promise.all(
    instances.map((instance) =>
      db_instance.get(instance.assetId, instance.instanceId),
    ),
  );

  const content = resolvedInstances
    .filter((instance) => instance !== null)
    .map(instance_to_package_content);

  const response = {
    id: pack.id,
    name: pack.name,
    items: content.length,
    content,
  };



  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(response));

  return;
};
