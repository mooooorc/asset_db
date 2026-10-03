import {
  Body,
  Controller,
  Inject,
  Post,
  BadRequestException,
  Get,
  Param,
  Delete,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./user.service.js";
import { user_schema } from "./user.schema.js";
import type { User, UserId } from "./user.domain.js";
import { CurrentUser } from "@nestjs/authentication";
import { Roles, RolesGuard } from "./auth/roles.guard.js";
import type {
  ConsumerId,
  ConsumerMembership,
} from "../consumer/consumer.domain.js";

@Controller("users")
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly service: UserService,
  ) {}

  /**
   * Creates a new user.
   * Only Admins can create users.
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async create(@Body() body: unknown) {
    const result = user_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid user");
    }

    return this.service.save(result.data);
  }

  /**
   * Returns the authenticated user.
   */
  @Get("me")
  getMe(@CurrentUser() user: User) {
    return user;
  }

  /**
   * Returns all users.
   */
  @Get()
  getAll() {
    return this.service.getAll();
  }
  /**
   * Returns the consumers linked to a user.
   */
  @Get(":id/consumers")
  async getConsumers(@Param("id") id: string) {
    return this.service.getConsumers(id as UserId);
  }

  /**
   * Returns a user by ID.
   */
  @Get(":id")
  get(@Param("id") id: string) {
    return this.service.get(id as UserId);
  }

  /**
   * Deletes the authenticated user.
   */
  @Delete("me")
  deleteMe(@CurrentUser() user: User) {
    return this.service.delete(user.id);
  }

  /**
   * Deletes a user by ID.
   * Only Admins can access this endpoint.
   */
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  delete(@Param("id") id: string) {
    return this.service.delete(id as UserId);
  }

  /**
   * Link a user with a Consumer.
   * Only Admins can access this endpoint.
   */
  @Post(":id/consumers/:consumerId")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async linkToConsumer(
    @Param("id") id: string,
    @Param("consumerId") consumerId: string,
    @Body() body: {membership: ConsumerMembership}
  ) {
    await this.service.linkToConsumer(
      id as UserId,
      consumerId as ConsumerId,
      body.membership
    );

    return;
  }
  /**
   * Unlink a user from a Consumer.
   * Only Admins can acces this endpoint.
   */
  @Delete(":id/consumers/:consumerId")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async unlinkFromConsumer(
    @Param("id") id: string,
    @Param("consumerId") consumerId: string,
  ) {
    await this.service.unlinkFromConsumer(
      id as UserId,
      consumerId as ConsumerId,
    );

    return;
  }
}
