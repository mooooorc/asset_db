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

import { AssetService } from "./asset.service.js";
import { asset_schema } from "./asset.schema.js";
import type { AssetId } from "./asset.domain.js";
import { Roles, RolesGuard } from "../user/auth/roles.guard.js";


@Controller("assets")
export class AssetController {
  constructor(
    @Inject(AssetService)
    private readonly service: AssetService,
  ) {}

  /**
   * Creates a new Asset.
   * Only Managers can access this endpoint.
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles("Manager")
  async create(@Body() body: unknown) {
    const result = asset_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid asset");
    }

    return this.service.save(result.data);
  }

  /**
   * Returns all Assets.
   * Only Managers can access this endpoint.
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles("Manager")
  async getAll() {
    return this.service.getAll();
  }

  /**
   * Returns an Asset by ID.
   * Only Managers can access this endpoint.
   */
  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles("Manager")
  async get(@Param("id") id: string) {
    const asset = await this.service.get(id as AssetId);

    if (!asset) {
      throw new NotFoundException("Asset not found");
    }

    return asset;
  }

  /**
   * Deletes an Asset by ID.
   * Only Managers can access this endpoint.
   */
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles("Manager")
  async delete(@Param("id") id: string) {
    await this.service.delete(id as AssetId);

    return;
  }
}