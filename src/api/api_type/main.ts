import type { IncomingMessage, ServerResponse } from "node:http";

import { post_api_type } from "./post.js";
import { get_api_type } from "./get.js";
import { get_all_api_types } from "./get_all.js";
import { delete_api_type } from "./delete.js";


export const api_type = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (req.method === "POST" && req.url === "/types") {
    await post_api_type(req, res);

    return;
  }

  if (req.method === "GET" && req.url === "/types") {
  await get_all_api_types(req, res);

  return;
}

  if (
  req.method === "GET" &&
  req.url?.startsWith("/types/") &&
  req.url.split("/").length === 3
) {
  await get_api_type(req, res);

  return;
}

if (
  req.method === "DELETE" &&
  req.url?.startsWith("/types/") &&
  req.url.split("/").length === 3
) {
  await delete_api_type(req, res);

  return;
}

 
};