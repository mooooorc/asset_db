import type { PackageId } from "../../domain/package.js";
import { connect } from "../client.js";
import { db_package } from "../db_package.js";

await connect();

const instances = await db_package.getResolvedInstances(
  "valencia-04" as PackageId,
);

console.log(instances);