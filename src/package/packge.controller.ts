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

import { package_schema } from "./package.schema.js";

import { PackageService } from "./package.service.js";
import type { PackageId, PackageInstance } from "./package.domain.js";
import { ConsumerGuard } from "../consumer/consumer.guard.js";
import { Authenticate, CurrentUser, Public } from "@nestjs/authentication";
import type { User } from "../user/user.domain.js";
import { DiscussionService } from "../discussion/discussion.service.js";

@Controller("packages")
export class PackageController {
  constructor(
    @Inject(PackageService)
    private readonly service: PackageService,

    @Inject(DiscussionService)
    private readonly discussionService: DiscussionService,
  ) {}

  @Post()
  async create(@Body() body: unknown) {
    const result = package_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    return this.service.save(result.data);
  }

  @Get()
  async getAll(@CurrentUser() user: User) {
    if (user.role !== "Manager") {
      throw new ForbiddenException();
    }

    return this.service.getAll();
  }

  @Get(":id")
  @Authenticate({ optional: true })
  @UseGuards(ConsumerGuard)
  async get(@Param("id") id: string) {
    const pack = await this.service.prepare(id as PackageId);

    if (!pack) {
      throw new NotFoundException("Package not found");
    }

    return pack;
  }

  @Post(":id/instances")
  async addInstance(
    @Param("id") id: string,
    @Body() body: PackageInstance,
    @CurrentUser() user: User,
  ) {
    if (user.role !== "Manager") {
      throw new ForbiddenException();
    }

    return this.service.addInstance(id as PackageId, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @CurrentUser() user: User) {
    if (user.role !== "Manager") {
      throw new ForbiddenException();
    }

    await this.service.delete(id as PackageId);
    return;
  }

  @Get(":id/blacklist")
  async getBlacklist(@Param("id") id: string, @CurrentUser() user: User) {
    if (user.role !== "Manager") {
      throw new ForbiddenException();
    }

    return this.service.getBlacklist(id as PackageId);
  }

  @Post(":id/blacklist")
  async addToBlacklist(
    @Param("id") id: string,
    @Body() body: PackageInstance,
    @CurrentUser() user: User,
  ) {
    if (user.role !== "Manager") {
      throw new ForbiddenException();
    }

    return this.service.addToBlacklist(id as PackageId, body);
  }

  @Authenticate({ optional: true })
  @UseGuards(ConsumerGuard)
  @Get(":id/discussions")
  async getDiscussions(@Param("id") id: string) {
    return this.discussionService.getByPackage(id as PackageId);
  }

  @Delete(":id/blacklist")
  async removeFromBlacklist(
    @Param("id") id: string,
    @Body() body: PackageInstance,
    @CurrentUser() user: User,
  ) {
    if (user.role !== "Manager") {
      throw new ForbiddenException();
    }

    return this.service.removeFromBlacklist(id as PackageId, body);
  }
}
