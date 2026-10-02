import { Injectable } from "@nestjs/common";
import type { DiscussionId, NewDiscussion } from "./discussion.domain.js";
import { save_discussion } from "./operations/save.js";
import { get_all_discussions } from "./operations/get_all.js";
import { get_discussion } from "./operations/get.js";


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
}