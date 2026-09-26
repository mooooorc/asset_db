import type { IncomingMessage, ServerResponse } from "node:http";
import { post_api_instance } from "./post.js";
import { get_api_instance } from "./get.js";
import { get_all_api_instances } from "./get_all.js";
import { delete_api_instance } from "./delete.js";

export const api_instance = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (req.method === "POST" && req.url === "/instances") {
    await post_api_instance(req, res);
    return
  }

  if (
    req.method === "GET" &&
    req.url?.startsWith("/instances/") &&
    req.url.split("/").length === 3
  ) {
    await get_all_api_instances(req, res);
    return
  }

  if (req.method === "GET" && req.url?.startsWith("/instances/")) {
    await get_api_instance(req, res);
    return
  }

  if (req.method === "DELETE" && req.url?.startsWith("/instances/")) {
    await delete_api_instance(req, res);
    return
  }
};
