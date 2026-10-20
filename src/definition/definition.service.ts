import { Injectable, NotFoundException } from "@nestjs/common";

import { save_definition } from "./operations/save_definition.js";
import { delete_definition } from "./operations/delete_definition.js";
import type {
  DefinitionId,
  DefinitionData,
  DefinitionTag,
} from "./definition.domain.js";
import { find_definition } from "./operations/find_definition.js";
import { get_definition } from "./operations/get_definition.js";

@Injectable()
export class DefinitionService {
  async get(tag: DefinitionTag) {
    const id = await find_definition.id_by_tag(tag);

    if (!id) {
      throw new NotFoundException(`Definition not found: ${tag}`);
    }

    return get_definition.self(id);
  }

  getAll() {
    return get_definition.all();
  }

  save(def: DefinitionData) {
    return save_definition(def);
  }

  async delete(tag: DefinitionTag) {
    const id = await find_definition.id_by_tag(tag);

    if (!id) {
      throw new NotFoundException(`Definition not found: ${tag}`);
    }

    return delete_definition(id);
  }
}
