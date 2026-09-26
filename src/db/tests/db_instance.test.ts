import type { PackageId } from "../../domain/package.js";
import { connect } from "../client.js";
import { db_package } from "../db_package/main.js";

await connect();

const instances = await db_package.getInstances(
  "valencia-04" as PackageId,
);

console.log(instances);