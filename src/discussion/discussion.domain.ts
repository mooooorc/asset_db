import type { PackageId } from "../package/package.domain.js";
import type { UserId } from "../user/user.domain.js";

export type DiscussionId = string & {
  readonly __brand: "DiscussionId";
};

export type Discussion = {
  id: DiscussionId;
  package: PackageId;
  index: number;
  title: string;
  author: UserId;
};

export type NewDiscussion = {
  package: PackageId;
  title: string;
  author: UserId;
};