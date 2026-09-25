import { createServer, ServerResponse } from "node:http";

import { connect } from "./db/client.js";
import { api_definition } from "./api/api_definition.js";
import { api_asset } from "./api/api_asset.js";
import { api_instance } from "./api/api_instance.js";
import { api_package } from "./api/api_package.js";

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
    await api_definition(req, res);
    return;
  }
  if (req.url?.startsWith("/assets")) {
    await api_asset(req, res);
    return;
  }
  if(req.url?.startsWith("/instances")) {
    await api_instance(req, res);
    return;
  }
  if (req.url?.startsWith("/packages")) {
  await api_package(req, res);
  return;
}

  res.writeHead(404);
  res.end();
});

server.listen(3000, () => {
  console.log("API listening on http://localhost:3000");
});
