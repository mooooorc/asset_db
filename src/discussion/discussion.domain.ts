import type { ConsumerId } from "../consumer/consumer.domain.js";
import type { PackageId } from "../package/package.domain.js";
import type { UserId } from "../user/user.domain.js";

export type DiscussionId = string & {
  readonly __brand: "DiscussionId";
};

export type DiscussionCommentId = string & {
  readonly __brand: "DiscussionCommentId";
};

export type Discussion = {
  id: DiscussionId;
  package: PackageId;
  index: number;
  title: string;
  author: UserId;
  consumer?: ConsumerId;
};

export type NewDiscussion = {
  package: PackageId;
  title: string;
  author: UserId;
  consumer?: ConsumerId;
};


export type DiscussionComment = {
  id: DiscussionCommentId;
  discussion: DiscussionId;
  author: UserId;
  content: string;
};

export type NewDiscussionComment = {
  discussion: DiscussionId;
  author: UserId;
  content: string;
};