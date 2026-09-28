import type { IncomingMessage, ServerResponse } from "node:http";

import { db_type } from "../../db/db_type/main.js";
import type { TypeId } from "../../domain/type.js";

export const get_api_type = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const id = req.url?.split("/")[2] as TypeId;

  const type = await db_type.get(id);

  if (!type) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Type not found",
      }),
    );
    return;
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(type));
};