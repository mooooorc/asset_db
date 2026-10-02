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
} from "@nestjs/common";

import type { User } from "../user/user.domain.js";
import { DiscussionService } from "./discussion.service.js";
import { discussion_schema } from "./discussion.schema.js";
import { CurrentUser } from "@nestjs/authentication";
import type { PackageId } from "../package/package.domain.js";
import type { DiscussionId } from "./discussion.domain.js";

@Controller("discussions")
export class DiscussionController {
  constructor(
    @Inject(DiscussionService)
    private readonly service: DiscussionService,
  ) {}

  @Post()
  async create(@Body() body: unknown, @CurrentUser() user: User) {
    const result = discussion_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    return this.service.save({
      ...result.data,
      package: result.data.package as PackageId,
      author: user.id,
    });
  }

  @Get()
  async getAll(@CurrentUser() user: User) {
    if (user.role !== "Manager") throw new ForbiddenException();

    return this.service.getAll();
  }

  @Get(":id")
async get(@Param("id") id: string) {
  const discussion = await this.service.get(id as DiscussionId);

  if (!discussion) {
    throw new NotFoundException("Discussion not found");
  }

  return discussion;
}
}
