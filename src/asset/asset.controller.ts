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

import { AssetService } from "./asset.service.js";
import { asset_schema } from "./asset.schema.js";
import type { AssetId, AssetTag } from "./asset.domain.js";
import { Roles, RolesGuard } from "../user/auth/roles.guard.js";


@Controller("assets")
export class AssetController {
  constructor(
    @Inject(AssetService)
    private readonly service: AssetService,
  ) {}

  /**
   * Creates a new Asset.
   * Only Builders can access this endpoint.
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async create(@Body() body: unknown) {
    const result = asset_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid asset");
    }

    return this.service.save(result.data);
  }

  /**
   * Returns all Assets.
   * Only Builders can access this endpoint.
   */
  @Get()
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async getAll() {
    return this.service.getAll();
  }

  /**
   * Returns an Asset by ID.
   * Only Builders can access this endpoint.
   */
  @Get(":tag")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async get(@Param("tag") tag: string) {
    const asset = await this.service.get(tag as AssetTag);

    if (!asset) {
      throw new NotFoundException("Asset not found");
    }

    return asset;
  }

  /**
   * Deletes an Asset by tag.
   * Only Builders can access this endpoint.
   */
  @Delete(":tag")
  @UseGuards(RolesGuard)
  @Roles("Builder")
  async delete(@Param("tag") tag: string) {
    await this.service.delete(tag as AssetTag);

    return;
  }
}