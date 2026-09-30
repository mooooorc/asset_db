import { Inject, Injectable } from "@nestjs/common";

import { get_asset } from "./operations/get.js";
import { get_all_assets } from "./operations/get_all.js";
import { DefinitionService } from "../definition/definition.service.js";
import { save_asset } from "./operations/save.js";
import { delete_asset } from "./operations/delete.js";

import { get_assets_by_def } from "./operations/get_by_def.js";
import type { Asset, AssetId } from "./asset.domain.js";
import type { DefinitionId } from "../definition/definition.domain.js";

@Injectable()
export class AssetService {
  
    constructor(
      @Inject(DefinitionService)
    private readonly definitionService: DefinitionService,
  ) {}

  get(id: AssetId) {
    return get_asset(id);
  }

  getByDefs(ids: DefinitionId[]) {
  return get_assets_by_def(ids);
}

  getAll() {
    return get_all_assets();
  }
  save(asset: Asset) {
    return save_asset(asset, this.definitionService);
  }

  delete(id: AssetId) {
    return delete_asset(id)
  }
}