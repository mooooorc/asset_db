import type { IncomingMessage, ServerResponse } from "node:http";
import { db_definition } from "../../db/db_def/main.js";
import type { DefinitionId } from "../../domain/definition.js";

export const get_api_def = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (!req.url) return;

  const id = req.url.split("/")[2];

  const definition = await db_definition.get(id as DefinitionId);

  if (!definition) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: "Definition not found",
      }),
    );
    return;
  }


    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(definition));
    return;
};
