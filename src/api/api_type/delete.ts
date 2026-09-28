import type { IncomingMessage, ServerResponse } from "node:http";

import { db_type } from "../../db/db_type/main.js";
import type { TypeId } from "../../domain/type.js";
import { replace_db_definition_type } from "../../db/db_def/replace_type.js";

export const delete_api_type = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const id = req.url?.split("/")[2] as TypeId;

  if (id === "string" || id === "number" || id === "boolean") {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Base types cannot be deleted",
      }),
    );
    return;
  }

  try {
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

    await replace_db_definition_type(id, type.baseType as TypeId);

    await db_type.delete(id);

    res.statusCode = 204;
    res.end();
  } catch (error) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Invalid type",
      }),
    );
  }
};