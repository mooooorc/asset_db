

import { save_db_instance } from "./save.js";
import { get_db_instance } from "./get.js";
import { get_all_db_instances  } from "./get_all.js";
import { get_db_instance_by_condition  } from "./get_by_condition.js";
import { delete_db_instance } from "./delete.js";

export const db_instance = {
  save: save_db_instance,
  get: get_db_instance,
  getAl: get_all_db_instances,
  getByCondition: get_db_instance_by_condition,
  delete: delete_db_instance
}