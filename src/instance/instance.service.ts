import { Inject, Injectable } from "@nestjs/common";

import { get_instance } from "./operations/read/get.js";

import { save_instance } from "./operations/write/save.js";
import { AssetService } from "../asset/asset.service.js";
import { delete_instance } from "./operations/delete/delete.js";

import type { AssetId } from "../asset/asset.domain.js";
import type {
  Instance,
  InstanceId,
  new_instance,
} from "./instance.domain.js";
import { get_instance_by_index } from "./operations/read/get_by_index.js";
import { get_all_instances } from "./operations/read/get_all.js";



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


  save(instance: new_instance) {
    return save_instance(instance, this.assetService, this);
  }

  delete(type: AssetId, id: InstanceId) {
    return delete_instance(type, id);
  }
}
