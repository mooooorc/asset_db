import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";

import { package_schema } from "./package.schema.js";

import { PackageService } from "./package.service.js";
import type { PackageId, PackageInstance, PackageTag } from "./package.domain.js";
import { ConsumerGuard } from "../consumer/consumer.guard.js";
import { Authenticate } from "@nestjs/authentication";

import { DiscussionService } from "../discussion/discussion.service.js";
import { Roles, RolesGuard } from "../user/auth/roles.guard.js";
import type { DiscussionId } from "../discussion/discussion.domain.js";
import type { InstanceTag } from "../instance/instance.domain.js";

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
  @Get(":tag")
  @Authenticate({ optional: true })
  @UseGuards(ConsumerGuard)
  async get(@Param("tag") tag: string) {
    const pack = await this.service.prepare(tag as PackageTag);

    if (!pack) {
      throw new NotFoundException("Package not found");
    }

    return pack;
  }



  /**
   * Deletes a Package.
   * Only Builders can access this endpoint.
   */
  @Delete(":tag")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async delete(@Param("tag") tag: string) {
    await this.service.delete(tag as PackageTag);
    return;
  }

  /**
   * Adds an Instance to a Package.
   * Only Builders can access this endpoint.
   */
  @Post(":tag/instances")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async addInstance(@Param("tag") tag: string, @Body() body: InstanceTag) {
    return this.service.addInstance(tag as PackageTag, body);
  }

  /**
   * Returns the blacklist of a Package.
   * Only Builder can access this endpoint.
   */
  @Get(":tag/blacklist")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async getBlacklist(@Param("tag") tag: string) {
    return this.service.getBlacklist(tag as PackageTag);
  }

  /**
   * Adds an Instance to a Package blacklist.
   * Only Builder can access this endpoint.
   */
  @Post(":tag/blacklist")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async addToBlacklist(@Param("tag") tag: string, @Body() body: InstanceTag) {
    return this.service.addToBlacklist(tag as PackageTag, body);
  }

  /**
   * Removes an Instance from a Package blacklist.
   * Only Builder can access this endpoint.
   */
  @Delete(":tag/blacklist")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async removeFromBlacklist(
    @Param("tag") tag: string,
    @Body() body: InstanceTag,
  ) {
    return this.service.removeFromBlacklist(tag as PackageTag, body);
  }

  /**
   * Returns the Discussions belonging to a Package.
   * Access follows the Package access rules.
   */
  @Authenticate({ optional: true })
  @UseGuards(ConsumerGuard)
  @Get(":tag/discussions")
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
