import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { DefinitionService } from "../definition/definition.service.js";


import type { AssetData, AssetId, AssetTag } from "./asset.domain.js";
import type { DefinitionTag } from "../definition/definition.domain.js";

import { delete_asset } from "./operations/delete_asset.js";

import { get_asset } from "./operations/get_asset.js";
import { find_asset } from "./operations/find_asset.js";
import { create_asset } from "./operations/create_asset.js";

@Injectable()
export class AssetService {
  constructor(
    @Inject(DefinitionService)
    private readonly definitionService: DefinitionService,
  ) {}

  async get(tag: AssetTag) {
    const id = await this.get_id(tag);
    return get_asset.self(id);
  }

  getByDefs(tags: DefinitionTag[]) {
    return get_asset.by_def(tags);
  }

  getAll() {
    return get_asset.all();
  }

  getDefinition(tag: DefinitionTag) {
    return this.definitionService.get(tag);
  }

  save(asset: AssetData) {
    return create_asset.self(asset);
  }

  async delete(tag: AssetTag) {
    const id = await this.get_id(tag);
    return delete_asset.self(id);
  }

  

  private async get_id(tag: AssetTag): Promise<AssetId> {
    const id = await find_asset.id_by_tag(tag);

    if (!id) {
      throw new NotFoundException(`Asset not found: ${tag}`);
    }

    return id;
  }
}
