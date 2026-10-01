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
} from "@nestjs/common";

import { AssetService } from "./asset.service.js";
import { asset_schema } from "./asset.schema.js";
import type { AssetId } from "./asset.domain.js";
import { CurrentUser } from "@nestjs/authentication";
import type { User } from "../user/user.domain.js";


@Controller("assets")
export class AssetController {
  constructor(
      @Inject(AssetService)
      private readonly service: AssetService,
    ) {}

  @Get()
  async getAll(@CurrentUser() user: User) {
    
    if(user.role !== "Manager") {
      throw new ForbiddenException();
    }

    return this.service.getAll();
  }

  @Get(":id")
  async get(@Param("id") id: string, @CurrentUser() user: User) {

    if(user.role !== "Manager") { throw new ForbiddenException(); }

    const asset = await this.service.get(id as AssetId);

    if (!asset) {
      throw new NotFoundException("Asset not found");
    }

    return asset;
  }

  @Post()
  async create(@Body() body: unknown, @CurrentUser() user: User) {

    if(user.role !== "Manager") { throw new ForbiddenException(); }
    const result = asset_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid asset");
    }

    return this.service.save(result.data);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @CurrentUser() user: User) {

     if(user.role !== "Manager") { throw new ForbiddenException(); }

    await this.service.delete(id as AssetId);

    return;
  }
}
