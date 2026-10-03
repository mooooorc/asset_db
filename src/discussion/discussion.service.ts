import { Injectable } from "@nestjs/common";
import type { DiscussionCommentId, DiscussionId, NewDiscussion, NewDiscussionComment } from "./discussion.domain.js";
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
import { save_discussion_comment } from "./comment/operations/save.js";
import { get_discussion_comments } from "./comment/operations/get.js";
import { delete_discussion_comment } from "./comment/operations/delete.js";
import { get_discussion_comment_by_id } from "./comment/operations/get_by_id.js";


@Injectable()
export class DiscussionService {
  save(discussion: NewDiscussion) {
    return save_discussion(discussion);
  }

  saveComment(comment: NewDiscussionComment) {
    return save_discussion_comment(comment);
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

  support(id: DiscussionId, userId: UserId, consumerId: ConsumerId) {
    return save_support_discussion(id, userId, consumerId);
  }

  getSupports(id: DiscussionId) {
    return get_discussion_supports(id);
  }

  getComments(id: DiscussionId){
    return get_discussion_comments(id)
  }

  getComment(commentId: DiscussionCommentId) {
    return get_discussion_comment_by_id(commentId)
  }

  delete(id: DiscussionId) {
    return delete_discussion(id);
  }

  deleteComment(commentId: DiscussionCommentId) {
  return delete_discussion_comment(commentId);
}
}
