import { instance_to_package_content } from "../src/domain/package.js";


const instance = {
  asset_db_id: "123" as any,
  type: "pipes" as any,
  properties: {
    name: "pipe-01",
    city: "Valencia",
  },
};

console.log(instance_to_package_content(instance));