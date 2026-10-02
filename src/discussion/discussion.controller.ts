import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";

import type { User } from "../user/user.domain.js";
import { DiscussionService } from "./discussion.service.js";
import { discussion_schema } from "./discussion.schema.js";
import { CurrentUser } from "@nestjs/authentication";
import type { PackageId } from "../package/package.domain.js";
import type { DiscussionId } from "./discussion.domain.js";
import { UserService } from "../user/user.service.js";
import { ConsumerService } from "../consumer/consumer.service.js";
import { Roles, RolesGuard } from "../user/auth/roles.guard.js";
import type { ConsumerId } from "../consumer/consumer.domain.js";

import { support_schema } from "./support/support.schema.js";

@Controller("discussions")
export class DiscussionController {
  constructor(
    @Inject(DiscussionService)
    private readonly service: DiscussionService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(ConsumerService)
    private readonly consumerService: ConsumerService,
  ) {}

  /**
   * Creates a new Discussion.
   * Viewers can only create Discussions for Packages they can access.
   */
  @Post()
  async create(@Body() body: unknown, @CurrentUser() user: User) {
    const result = discussion_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    const packageId = result.data.package as PackageId;
    const consumerId = result.data.consumer as ConsumerId;

    if (user.roles.includes("Viewer") ) {
      if (!consumerId) {
        throw new BadRequestException("Consumer is required");
      }

      const consumerIds = await this.userService.getConsumers(user.id);

      if (!consumerIds.includes(consumerId)) {
        throw new ForbiddenException();
      }

      const hasAccess = await this.consumerService.hasPackageAccess(
        [consumerId],
        packageId,
      );

      if (!hasAccess) {
        throw new ForbiddenException();
      }
    }

    return this.service.save({
      ...result.data,
      package: packageId,
      author: user.id,
      consumer: consumerId,
    });
  }

  /**
   * Supports a Discussion from the context of a Consumer.
   * The authenticated User must be associated with the Consumer
   * and the Consumer must have access to the Discussion's Package.
   */
  @Post(":id/support")
  async support(
    @Param("id") id: string,
    @Body() body: unknown,
    @CurrentUser() user: User,
  ) {
    const result = support_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    const discussionId = id as DiscussionId;
    const consumerId = result.data.consumer;

    const discussion = await this.service.get(discussionId);

    if (!discussion) {
      throw new NotFoundException("Discussion not found");
    }

    const consumerIds = await this.userService.getConsumers(user.id);

    if (!consumerIds.includes(consumerId)) {
      throw new ForbiddenException();
    }

    const hasAccess = await this.consumerService.hasPackageAccess(
      [consumerId],
      discussion.package,
    );

    if (!hasAccess) {
      throw new ForbiddenException();
    }

    await this.service.support(discussionId, user.id, consumerId);

    return;
  }

  /**
   * Returns all Discussions.
   * Only Builders can access this endpoint.
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async getAll() {
    return this.service.getAll();
  }

  /**
   * Returns a Discussion by ID.
   * Only Builders can access this endpoint.
   */
  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async get(@Param("id") id: string) {
    const discussion = await this.service.get(id as DiscussionId);

    if (!discussion) {
      throw new NotFoundException("Discussion not found");
    }

    return discussion;
  }

  /**
   * Returns the supporters of a Discussion.
   *
   * Only Builders can access this endpoint.
   */
  @Get(":id/supports")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async getSupports(@Param("id") id: string) {
    return this.service.getSupports(id as DiscussionId);
  }

  /**
 * Deletes a Discussion by ID.
 *
 * Builders can delete any Discussion.
 * Other users can only delete their own Discussion.
 */
@Delete(":id")
async delete(@Param("id") id: string, @CurrentUser() user: User) {
  const discussion = await this.service.get(id as DiscussionId);

  if (!discussion) {
    throw new NotFoundException("Discussion not found");
  }

  if (
    !user.roles.includes("Builder") &&
    discussion.author !== user.id
  ) {
    throw new ForbiddenException();
  }

  await this.service.delete(id as DiscussionId);

  return;
}
}
