
import { save_db_def } from "./save.js";
import { get_db_def } from "./get.js";
import { get_all_db_def } from "./get_all.js";
import { delete_db_def } from "./delete.js";


export const db_definition = {
  save: save_db_def,
  get: get_db_def,
  getAll: get_all_db_def,
  delete: delete_db_def
};
