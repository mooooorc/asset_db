import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { delete_instance } from "./operations/delete_instance.js";

import type { AssetId, AssetTag } from "../asset/asset.domain.js";
import type {
  InstanceData,
  InstanceId,
  InstanceTag,
} from "./instance.domain.js";

import { get_instance } from "./operations/get_instance.js";

import { find_instance } from "./operations/find_instance.js";
import { find_asset } from "../asset/operations/find_asset.js";
import { create_instance } from "./operations/create_instance.js";
import { DefinitionService } from "../definition/definition.service.js";
import { AssetService } from "../asset/asset.service.js";
import { PersistenceService } from "../persistence/persistence.service.js";

@Injectable()
export class InstanceService {
  constructor(
   
    @Inject(DefinitionService)
    private readonly definitionService: DefinitionService,
     @Inject(AssetService)
    private readonly assetService: AssetService,

    @Inject(PersistenceService)
    private readonly persistenceService: PersistenceService
  ) {}

  async get(tag: InstanceTag) {
    const id = await this.get_id(tag);
    const asset_id = await find_asset.id_by_tag(tag.assetTag);

    if (!asset_id) {
      throw new Error("Not found");
    }
    return get_instance.self(
      asset_id,
      id,
      this.definitionService,
      this.assetService,
    );
  }

  get_by_id(asset_id: AssetId, id: InstanceId) {

    
    return get_instance.self(
      asset_id,
      id,
      this.definitionService,
      this.assetService,
    );
  }

  async getAll(assetTag: AssetTag) {

    const id = await this.assetService.find_id_by_tag(assetTag);

    if (!id) {
      throw new NotFoundException(`Asset not found: ${assetTag}`);
    }

    return get_instance.all(id, this.definitionService);
  }

  get_all_by_asset_id(asset_id: AssetId) {

    return get_instance.all(
      asset_id,
      this.definitionService
    );
  }


  save(data: InstanceData) {
    return create_instance.self(
      data,
      this.assetService,
      this.definitionService,
      this.persistenceService
    );
  }

  async delete(tag: InstanceTag) {

    const id = await this.get_id(tag);
    return delete_instance.self(id);

  }

  get_id_by_tag(tag: InstanceTag) {
    return find_instance.id_by_tag(tag, this.assetService);
  }

  find_asset_id(id: InstanceId) {
    return find_instance.asset_id(id);
  }

  private async get_id(tag: InstanceTag): Promise<InstanceId> {
    const id = await find_instance.id_by_tag(tag, this.assetService);

    if (!id) {
      throw new NotFoundException(`Instance not found: ${tag}`);
    }

    return id;
  }
}
