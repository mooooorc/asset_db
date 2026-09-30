import { Inject, Injectable } from "@nestjs/common";

import { get_instance } from "./operations/get.js";

import { get_all_instances } from "./operations/get_all.js";
import { save_instance } from "./operations/save.js";
import { AssetService } from "../asset/asset.service.js";
import { delete_instance } from "./operations/delete.js";

import type { AssetId } from "../asset/asset.domain.js";
import type {
  Instance,
  InstanceId,
  InstanceReference,
} from "./instance.domain.js";
import type { DefinitionId } from "../definition/definition.domain.js";
import type { PackageConditionOperator } from "../package/package.domain.js";
import { get_instance_by_index } from "./operations/get_by_index.js";


@Injectable()
export class InstanceService {
  constructor(
    @Inject(AssetService)
    private readonly assetService: AssetService,
  ) {}

  get(type: AssetId, id: InstanceId) {
    return get_instance(type, id);
  }

  getAll(type: AssetId) {
    return get_all_instances(type);
  }

 

  getByIndex(type: AssetId, index: number) {
    return get_instance_by_index(type, index);
  }


  save(instance: Omit<Instance, "asset_db_id" | "index">) {
    return save_instance(instance, this.assetService, this);
  }

  delete(type: AssetId, id: InstanceId) {
    return delete_instance(type, id);
  }
}
