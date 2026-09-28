import { delete_db_type } from "./delete.js";
import { get_db_type } from "./get.js";
import { get_all_db_types } from "./get_all.js";
import { save_db_type } from "./save.js";

export const db_type = {
    save: save_db_type,
    get: get_db_type,
    getAll: get_all_db_types,
    delete: delete_db_type
}