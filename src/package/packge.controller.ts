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
import { Authenticate } from "@nestjs/authentication";

import { DiscussionService } from "../discussion/discussion.service.js";
import { Roles, RolesGuard } from "../user/auth/roles.guard.js";
import type { DiscussionId } from "../discussion/discussion.domain.js";

@Controller("packages")
export class PackageController {
  constructor(
    @Inject(PackageService)
    private readonly service: PackageService,
    @Inject(DiscussionService)
    private readonly discussionService: DiscussionService,
  ) {}

  /**
   * Creates a new Package.
   * Only Builders can access this endpoint.
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async create(@Body() body: unknown) {
    const result = package_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException(result.error);
    }

    return this.service.save(result.data);
  }

  /**
   * Returns all Packages.
   * Only Builders can access this endpoint.
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async getAll() {
    return this.service.getAll();
  }

  /**
   * Returns a Package and its resolved content.
   * Access is restricted to Builders, authorized Viewers, and Consumers with credential.
   */
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

  /**
   * Deletes a Package.
   * Only Builders can access this endpoint.
   */
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async delete(@Param("id") id: string) {
    await this.service.delete(id as PackageId);
    return;
  }

  /**
   * Adds an Instance to a Package.
   * Only Builders can access this endpoint.
   */
  @Post(":id/instances")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async addInstance(@Param("id") id: string, @Body() body: PackageInstance) {
    return this.service.addInstance(id as PackageId, body);
  }

  /**
   * Returns the blacklist of a Package.
   * Only Builder can access this endpoint.
   */
  @Get(":id/blacklist")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async getBlacklist(@Param("id") id: string) {
    return this.service.getBlacklist(id as PackageId);
  }

  /**
   * Adds an Instance to a Package blacklist.
   * Only Builder can access this endpoint.
   */
  @Post(":id/blacklist")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async addToBlacklist(@Param("id") id: string, @Body() body: PackageInstance) {
    return this.service.addToBlacklist(id as PackageId, body);
  }

  /**
   * Removes an Instance from a Package blacklist.
   * Only Builder can access this endpoint.
   */
  @Delete(":id/blacklist")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async removeFromBlacklist(
    @Param("id") id: string,
    @Body() body: PackageInstance,
  ) {
    return this.service.removeFromBlacklist(id as PackageId, body);
  }

  /**
   * Returns the Discussions belonging to a Package.
   * Access follows the Package access rules.
   */
  @Authenticate({ optional: true })
  @UseGuards(ConsumerGuard)
  @Get(":id/discussions")
  async getDiscussions(@Param("id") id: string) {
    return this.discussionService.getByPackage(id as PackageId);
  }

  /**
   * Returns the supporters of a Discussion within a Package context.
   *
   * Access follows the Package access rules.
   */
  @Authenticate({ optional: true })
  @UseGuards(ConsumerGuard)
  @Get(":id/discussions/:discussionId/supports")
  async getDiscussionSupports(@Param("discussionId") discussionId: string) {
    return this.discussionService.getSupports(discussionId as DiscussionId);
  }
}
