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
import type { AssetId } from "../asset/asset.domain.js";
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
  @Get(":type")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async getAll(@Param("type") type: string) {
    return this.service.getAll(type as AssetId);
  }

  /**
   * Returns an Instance by Asset type and ID.
   * Only Builder can access this endpoint.
   */
  @Get(":type/:id")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async get(
    @Param("type") type: string,
    @Param("id") id: string,
  ) {
    const instance = await this.service.get(
      type as AssetId,
      id as InstanceId,
    );

    if (!instance) {
      throw new NotFoundException("Instance not found");
    }

    return instance;
  }

  /**
   * Deletes an Instance by Asset type and ID.
   * Only Builder can access this endpoint.
   */
  @Delete(":type/:id")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async delete(
    @Param("type") type: string,
    @Param("id") id: string,
  ) {
    await this.service.delete(
      type as AssetId,
      id as InstanceId,
    );

    return;
  }
}
