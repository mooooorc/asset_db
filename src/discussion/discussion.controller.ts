import {
  BadRequestException,
  Body,
  Controller,
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

  if (user.role === "Viewer") {
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
   * Returns all Discussions.
   * Only Managers can access this endpoint.
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles("Manager")
  async getAll() {
    return this.service.getAll();
  }

  /**
   * Returns a Discussion by ID.
   * Only Managers can access this endpoint.
   */
  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles("Manager")
  async get(@Param("id") id: string) {
    const discussion = await this.service.get(id as DiscussionId);

    if (!discussion) {
      throw new NotFoundException("Discussion not found");
    }

    return discussion;
  }
}
