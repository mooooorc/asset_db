import { createServer, ServerResponse } from "node:http";

import { connect } from "./db/client.js";
import { definitions_api } from "./api/definitions.js";
import { assets_api } from "./api/assets.js";
import { instances_api } from "./api/instances.js";

await connect();

const setCorsHeaders = (res: ServerResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

const server = createServer(async (req, res) => {
  setCorsHeaders(res)

  if (req.method === "OPTIONS") {
  res.writeHead(204);
  res.end();
  return;
}

  if (req.url?.startsWith("/definitions")) {
    await definitions_api(req, res);
    return;
  }
  if (req.url?.startsWith("/assets")) {
    await assets_api(req, res);
    return;
  }
  if(req.url?.startsWith("/instances")) {
    await instances_api(req, res);
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(3000, () => {
  console.log("API listening on http://localhost:3000");
});
