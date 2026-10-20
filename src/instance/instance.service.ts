import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AssetService } from "../asset/asset.service.js";
import { delete_instance } from "./operations/delete_instance.js";

import type { AssetTag } from "../asset/asset.domain.js";
import type {
  InstanceData,
  InstanceId,
  InstanceTag,
} from "./instance.domain.js";

import { get_instance } from "./operations/get_instance.js";

import { find_instance } from "./operations/find_instance.js";
import { find_asset } from "../asset/operations/find_asset.js";
import { create_instance } from "./operations/create_instance.js";

@Injectable()
export class InstanceService {
  constructor(
    @Inject(AssetService)
    private readonly assetService: AssetService,
  ) {}

  async get(tag: InstanceTag) {
    const id = await this.get_id(tag);
    const asset_id = await find_asset.id_by_tag(tag.assetTag);

    if(!asset_id){ throw new Error("Not found")}
    return get_instance.self(asset_id, id);
  }

  async getAll(assetTag: AssetTag) {
    const id = await find_asset.id_by_tag(assetTag);

    if (!id) {
      throw new NotFoundException(`Asset not found: ${assetTag}`);
    }

    return get_instance.all(id);
  }

  save(data: InstanceData) {
    return create_instance.self(data, this.assetService);
  }

  delete(tag: InstanceTag) {
    return delete_instance.self(tag);
  }

  private async get_id(tag: InstanceTag): Promise<InstanceId> {
    const id = await find_instance.id_by_tag(tag);

    if (!id) {
      throw new NotFoundException(`Instance not found: ${tag}`);
    }

    return id;
  }
}
