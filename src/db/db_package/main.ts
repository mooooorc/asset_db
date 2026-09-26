

import { add_instance_to_db_package } from "./add_instance.js";
import { get_db_package } from "./get.js";
import { get_all_db_packages } from "./get_all.js";
import { get_db_package_instances } from "./get_instances.js";
import { save_db_package } from "./save.js";

export const db_package = {
  save: save_db_package,
  get: get_db_package,
  getAll: get_all_db_packages,
  addInstance: add_instance_to_db_package,
  getInstances: get_db_package_instances
};
