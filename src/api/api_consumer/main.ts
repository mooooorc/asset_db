import type { IncomingMessage, ServerResponse } from "node:http";

import { delete_api_consumer } from "./delete.js";
import { get_api_consumer } from "./get.js";
import { get_all_api_consumers } from "./get_all.js";
import { post_api_consumer } from "./post.js";

export const api_consumer = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (req.method === "POST" && req.url === "/consumers") {
    await post_api_consumer(req, res);

    return;
  }

  if (req.method === "GET" && req.url === "/consumers") {
    await get_all_api_consumers(req, res);

    return;
  }

  if (
    req.method === "GET" &&
    req.url?.startsWith("/consumers/")
  ) {
    await get_api_consumer(req, res);

    return;
  }

  if (
    req.method === "DELETE" &&
    req.url?.startsWith("/consumers/")
  ) {
    await delete_api_consumer(req, res);

    return;
  }
};