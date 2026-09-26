
import { save_db_asset } from "./save.js";
import { get_db_asset } from "./get.js";
import { get_all_db_assets } from "./get_all.js";
import { get_db_asset_by_def} from "./get_by_def.js";
import { remove_db_asset_column } from "./remove_column.js";
import { delete_db_asset } from "./delete.js";

export const db_asset = {

  save: save_db_asset,
  get: get_db_asset,
  getAll: get_all_db_assets,
  getByDefs: get_db_asset_by_def,
  removeColumn: remove_db_asset_column,
  delete: delete_db_asset
  
};
