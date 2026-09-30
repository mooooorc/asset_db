import { Injectable } from "@nestjs/common";
import { get_def } from "./operations/get.js";

import { get_all_defs } from "./operations/get_all.js";
import { save_def } from "./operations/save_def.js";
import { delete_def } from "./operations/delete.js";
import type { Definition, DefinitionId } from "./definition.domain.js";

@Injectable()
export class DefinitionService {
  get(id: DefinitionId) {
    return get_def(id);
  }

  getAll() {
    return get_all_defs();
  }

  save(def: Definition){
    return save_def(def);
  }

  delete(id: DefinitionId) {
    return delete_def(id);
  }
}