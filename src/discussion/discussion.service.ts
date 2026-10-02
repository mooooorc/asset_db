import { Injectable } from "@nestjs/common";
import type { DiscussionId, NewDiscussion } from "./discussion.domain.js";
import { save_discussion } from "./operations/save.js";
import { get_all_discussions } from "./operations/get_all.js";
import { get_discussion } from "./operations/get.js";
import type { PackageId } from "../package/package.domain.js";
import { get_discussions_by_package } from "./operations/get_by_package.js";
import { delete_discussion } from "./operations/delete.js";
import type { UserId } from "../user/user.domain.js";
import type { ConsumerId } from "../consumer/consumer.domain.js";
import { save_support_discussion } from "./support/operations/save.js";
import { get_discussion_supports } from "./support/operations/get.js";


@Injectable()
export class DiscussionService {
  save(discussion: NewDiscussion) {
    return save_discussion(discussion);
  }
  getAll() {
    return get_all_discussions();
  }

  get(id: DiscussionId) {
    return get_discussion(id);
  }

  getByPackage(packageId: PackageId) {
    return get_discussions_by_package(packageId);
  }

  support(discussionId: DiscussionId, userId: UserId, consumerId: ConsumerId) {
    return save_support_discussion(discussionId, userId, consumerId);
  }

  getSupports(discussionId: DiscussionId) {
    return get_discussion_supports(discussionId);
  }

  delete(id: DiscussionId) {
    return delete_discussion(id);
  }
}
