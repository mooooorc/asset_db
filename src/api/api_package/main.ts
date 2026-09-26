import type { IncomingMessage, ServerResponse } from "node:http";
import { post_api_package } from "./post.js";
import { get_all_api_packages } from "./get_all.js";
import { get_api_package } from "./get.js";
import { post_api_package_instance } from "./post_instance.js";
import { get_api_package_instances } from "./get_instances.js";

export const api_package = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (req.method === "POST" && req.url === "/packages") {
    await post_api_package(req, res);
    return
  }

  if (req.method === "GET" && req.url === "/packages") {
    await get_all_api_packages(req, res);
    return
  }

  if (
    req.method === "GET" &&
    req.url?.startsWith("/packages/") &&
    req.url.split("/").length === 3
  ) {
    await get_api_package(req, res);
    return
  }

  if (
    req.method === "POST" &&
    req.url?.startsWith("/packages/") &&
    req.url.endsWith("/instances")
  ) {
    await post_api_package_instance(req, res);
    return
  }

  if (
    req.method === "GET" &&
    req.url?.startsWith("/packages/") &&
    req.url.endsWith("/instances")
  ) {
    await get_api_package_instances(req, res);
    return
  }
};
