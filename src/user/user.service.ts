import { Injectable } from "@nestjs/common";

import type { NewUser, User, UserId } from "./user.domain.js";
import { save_user } from "./operations/save.js";
import { get_user } from "./operations/get.js";
import { get_all_users } from "./operations/get_all.js";
import { delete_user } from "./operations/delete.js";

@Injectable()
export class UserService {
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
}
