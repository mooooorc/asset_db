import type { IncomingMessage, ServerResponse } from "node:http";

import { db_definition } from "../db/db_definition.js";
import type { DefinitionId } from "../domain/definition.js";
import { definition_schema } from "./schema/schema.js";


export const api_definition = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  if (req.method === "POST" && req.url === "/definitions") {
    const chunks: Buffer[] = [];

    for await (const chunk of req) {
      chunks.push(chunk);
    }

    const body = JSON.parse(Buffer.concat(chunks).toString());

    const result = definition_schema.safeParse(body);

    if (!result.success) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Invalid definition",
        }),
      );
      return;
    }

    try {
      const definition = await db_definition.save(result.data);

      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(definition));
    } catch (error) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Invalid definition",
        }),
      );
    }

    return;
  }

  if (req.method === "GET" && req.url === "/definitions") {
  const definitions = await db_definition.getAll();

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(definitions));
  return;
}

  if (req.method === "GET" && req.url?.startsWith("/definitions/")) {
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
  }

  

  if (req.method === "DELETE" && req.url?.startsWith("/definitions/")) {
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

    try {
      await db_definition.delete(id as DefinitionId);

      res.statusCode = 204;
      res.end();
    } catch (error) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: "Unable to delete definition",
        }),
      );
    }

    return;
  }
};
