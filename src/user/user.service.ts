import { Inject, Injectable } from "@nestjs/common";

import type { NewUser, User, UserId } from "./user.domain.js";
import { save_user } from "./operations/save.js";
import { get_user } from "./operations/get.js";
import { get_all_users } from "./operations/get_all.js";
import { delete_user } from "./operations/delete.js";
import { link_user_to_consumer } from "./operations/link_to_consumer.js";
import { ConsumerService } from "../consumer/consumer.service.js";
import { get_user_consumers } from "./operations/get_user_consumers.js";
import type { ConsumerId, ConsumerMembership } from "../consumer/consumer.domain.js";
import { unlink_user_from_consumer } from "./operations/unlink_from_consumer.js";

@Injectable()
export class UserService {
  constructor(
    @Inject(ConsumerService)
    private readonly consumerService: ConsumerService,
  ) {}

  save(data: NewUser) {
    return save_user(data);
  }

  get(id: UserId) {
    return get_user(id);
  }

  getAll() {
    return get_all_users();
  }

  delete(id: UserId) {
    return delete_user(id);
  }

  linkToConsumer(userId: UserId, consumerId: ConsumerId, membership: ConsumerMembership) {
    return link_user_to_consumer(userId, consumerId, membership);
  }

  unlinkFromConsumer(userId: UserId, consumerId: ConsumerId) {
    return unlink_user_from_consumer(userId, consumerId)
  }

  getConsumers(userId: UserId) {
  return get_user_consumers(userId);
}
}
