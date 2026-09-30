import { Inject, Injectable } from "@nestjs/common";

import { get_instance } from "./operations/get.js";

import { get_all_instances } from "./operations/get_all.js";
import { save_instance } from "./operations/save.js";
import { AssetService } from "../asset/asset.service.js";
import { delete_instance } from "./operations/delete.js";


import { get_instance_by_condition } from "./operations/get_by_condition.js";
import type { AssetId } from "../asset/asset.domain.js";
import type { Instance, InstanceId } from "./instance.domain.js";
import type { DefinitionId } from "../definition/definition.domain.js";
import type { PackageConditionOperator } from "../package/package.domain.js";

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
    return get_all_instances(type)
  }
  
  getByCondition(
  type: AssetId,
  definitionId: DefinitionId,
  operator: PackageConditionOperator,
  value: unknown,
) {
  return get_instance_by_condition(
    type,
    definitionId,
    operator,
    value,
  );
}

  save(instance: Omit<Instance, "asset_db_id">){
    return save_instance(instance, this.assetService)
  }

  delete(type: AssetId, id: InstanceId){
    return delete_instance(type, id)
  }

 
}