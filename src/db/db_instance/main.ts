

import { save_db_instance as save } from "./save.js";
import { get_db_instance as get } from "./get.js";
import { get_all_db_instances as getAll } from "./get_all.js";
import { get_db_instance_by_condition as getByCondition } from "./get_by_condition.js";
import { delete_db_instance as deleteInstance } from "./delete.js";

export const db_instance = {
  save,
  get,
  getAll,
  getByCondition,
  delete: deleteInstance
}