import { Injectable } from "@nestjs/common";

import { save_consumer } from "./operations/save.js";
import { verify_consumer } from "./operations/verify.js";
import { get_consumer } from "./operations/get.js";
import { get_all_consumers } from "./operations/get_all.js";
import { delete_consumer } from "./operations/delete.js";
import type { Consumer, ConsumerId } from "./consumer.domain.js";
import type { PackageId } from "../package/package.domain.js";
import { add_package_to_consumer } from "./operations/add_package.js";
import { has_package_access } from "./operations/has_package_access.js";

@Injectable()
export class ConsumerService {
  save(consumer: Consumer) {
    return save_consumer(consumer);
  }

  verify(secret: string) {
    return verify_consumer(secret);
  }

  get(id: ConsumerId) {
    return get_consumer(id);
  }

  getAll() {
    return get_all_consumers();
  }

  addPackage(consumerId: ConsumerId, packageId: PackageId) {
  return add_package_to_consumer(consumerId, packageId);
}

  delete(id: ConsumerId) {
    return delete_consumer(id);
  }

  hasPackageAccess(
  consumerIds: ConsumerId[],
  packageId: PackageId,
) {
  return has_package_access(consumerIds, packageId);
}
}