import { delete_db_consumer } from "./delete.js";
import { get_db_consumer } from "./get.js";
import { get_all_db_consumers } from "./get_all.js";
import { save_db_consumer } from "./save.js";
import { verify_db_consumer } from "./verify.js";

export const db_consumer = {
    save: save_db_consumer,
    verify: verify_db_consumer,
    get: get_db_consumer,
    getAll: get_all_db_consumers,
    delete: delete_db_consumer
}