import { Injectable } from "@nestjs/common";

import { save_consumer } from "./operations/save.js";
import { verify_consumer } from "./operations/verify.js";
import { get_consumer } from "./operations/get.js";
import { get_all_consumers } from "./operations/get_all.js";
import { delete_consumer } from "./operations/delete.js";
import type { Consumer, ConsumerId } from "./consumer.domain.js";

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

  delete(id: ConsumerId) {
    return delete_consumer(id);
  }
}