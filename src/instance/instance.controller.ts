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
} from "@nestjs/common";
import { InstanceService } from "./instance.service.js";

import { instance_schema } from "./instance.schema.js";
import type { AssetId } from "../asset/asset.domain.js";
import type { InstanceId } from "./instance.domain.js";


@Controller("instances")
export class InstanceController {
  constructor(
    @Inject(InstanceService)
    private readonly service: InstanceService,
  ) {}

  @Get(":type")
  async getAll(@Param("type") type: string) {
    return this.service.getAll(type as AssetId);
  }

  @Post()
  async create(@Body() body: unknown) {
    const result = instance_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid instance");
    }

    return this.service.save(result.data);
  }

  @Get(":type/:id")
  async get(@Param("type") type: string, @Param("id") id: string) {
    const instance = await this.service.get(
      type as AssetId,
      id as InstanceId,
    );

    if (!instance) {
      throw new NotFoundException("Instance not found");
    }

    return instance;
  }

  @Delete(":type/:id")
  async delete(@Param("type") type: string, @Param("id") id: string) {
    await this.service.delete(type as AssetId, id as InstanceId);

    return;
  }
}
