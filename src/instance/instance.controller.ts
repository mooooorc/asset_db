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
import { InstanceService } from "./instance.service.js";

import { instance_schema } from "./instance.schema.js";
import type { AssetId, AssetTag } from "../asset/asset.domain.js";
import type { InstanceId } from "./instance.domain.js";
import { Roles, RolesGuard } from "../user/auth/roles.guard.js";

@Controller("instances")
export class InstanceController {
  constructor(
    @Inject(InstanceService)
    private readonly service: InstanceService,
  ) {}

  /**
   * Creates a new Instance.
   * Only Builders can access this endpoint.
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async create(@Body() body: unknown) {
    const result = instance_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid instance");
    }

    return this.service.save(result.data);
  }

  /**
   * Returns all Instances of an Asset.
   * Only Builders can access this endpoint.
   */
  @Get(":assetTag")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async getAll(@Param("assetTag") assetTag: string) {
    return this.service.getAll(assetTag as AssetTag);
  }

  /**
   * Returns an Instance by its tag.
   * Only Builders can access this endpoint.
   */
  @Get(":assetTag/:index")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async get(
    @Param("assetTag") assetTag: string,
    @Param("index") index: string,
  ) {
    const instance = await this.service.get({
      assetTag: assetTag as AssetTag,
      index: Number(index),
    });

    if (!instance) {
      throw new NotFoundException("Instance not found");
    }

    return instance;
  }

  /**
   * Deletes an Instance by its tag.
   * Only Builders can access this endpoint.
   */
  @Delete(":assetTag/:index")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async delete(
    @Param("assetTag") assetTag: string,
    @Param("index") index: string,
  ) {
    await this.service.delete({
      assetTag: assetTag as AssetTag,
      index: Number(index),
    });
  }
}