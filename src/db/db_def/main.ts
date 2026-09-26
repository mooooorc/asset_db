
import { save_db_def as save } from "./save.js";
import { get_db_def as get } from "./get.js";
import { get_all_db_def as getAll } from "./get_all.js";
import { delete_db_def } from "./delete.js";


export const db_definition = {
  save,
  get,
  getAll,
  delete: delete_db_def
};
