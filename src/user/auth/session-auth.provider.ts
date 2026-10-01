import { Injectable, Inject } from "@nestjs/common";
import {
  AuthenticationRegistry,
  SessionCookieProvider,
  type SessionRecord,
} from "@nestjs/authentication";
import type { User, UserId } from "../user.domain.js";
import { UserService } from "../user.service.js";

@Injectable()
export class SessionAuth extends SessionCookieProvider<User> {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,

    @Inject(AuthenticationRegistry)
    registry: AuthenticationRegistry,
  ) {
    super();

    registry.registerProvider(this);
  }

  validate(session: SessionRecord) {
    return this.userService.get(session.userId as UserId);
  }
}