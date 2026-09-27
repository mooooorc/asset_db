import type { IncomingMessage, ServerResponse } from "node:http";
import { db_package } from "../../db/db_package/main.js";
import {
  instance_to_package_content,
  type PackageId,
} from "../../domain/package.js";
import { db_instance } from "../../db/db_instance/main.js";

export const get_api_package = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (!req.url) return;

  const id = req.url.split("/")[2];

  const pack = await db_package.get(id as PackageId);

  if (!pack) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Package not found",
      }),
    );
    return;
  }

  const instances = await db_package.getInstances(pack.id);

  const resolvedInstances = await Promise.all(
    instances.map((instance) =>
      db_instance.get(instance.assetId, instance.instanceId),
    ),
  );

  const content = resolvedInstances
    .filter((instance) => instance !== null)
    .reduce<Record<string, Record<string, unknown>[]>>((content, instance) => {
      const asset = instance.type;

      if (!content[asset]) {
        content[asset] = [];
      }

      content[asset].push(instance_to_package_content(instance));

      return content;
    }, {});

  const response = {
    id: pack.id,
    name: pack.name,
    items: resolvedInstances.length,
    content,
  };

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(response));
};
