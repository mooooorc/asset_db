import type { IncomingMessage, ServerResponse } from "node:http";
import { get_all_api_assets } from "./get_all.js";
import { post_api_asset } from "./post.js";
import { get_api_asset } from "./get.js";
import { delete_api_asset } from "./delete.js";

export const api_asset = async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "GET" && req.url === "/assets") {
    await get_all_api_assets(res);
    return
  }

  if (req.method === "POST" && req.url === "/assets") {
    await post_api_asset(req, res);
    return
  }

  if (req.method === "GET" && req.url?.startsWith("/assets/")) {
    await get_api_asset(req, res)
    return
  }

  if (req.method === "DELETE" && req.url?.startsWith("/assets/")) {
    await delete_api_asset(req, res)
    return
  }
};
