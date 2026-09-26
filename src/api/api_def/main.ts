import type { IncomingMessage, ServerResponse } from "node:http";
import { post_api_def } from "./post.js";
import { get_all_api_defs } from "./get_all.js";
import { get_api_def } from "./get.js";
import { delete_api_def } from "./delete.js";

export const api_definition = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (req.method === "POST" && req.url === "/definitions") {
    await post_api_def(req, res);
    return
  }

  if (req.method === "GET" && req.url === "/definitions") {
   await get_all_api_defs(res);
   return
  }

  if (req.method === "GET" && req.url?.startsWith("/definitions/")) {
    await get_api_def(req, res);
    return
  }

  if (req.method === "DELETE" && req.url?.startsWith("/definitions/")) {
   await delete_api_def(req, res);
   return
  }
};
