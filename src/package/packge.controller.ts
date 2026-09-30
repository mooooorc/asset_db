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
import type { PackageId, PackageInstance } from "./package.domain.js";
import { ConsumerGuard } from "../consumer/consumer.guard.js";

@Controller("packages")
export class PackageController {
  constructor(
    @Inject(PackageService)
    private readonly service: PackageService,
  ) {}

  @Post()
  async create(@Body() body: unknown) {
    const result = package_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid package");
    }

    return this.service.save(result.data);
  }

  @Get()
  async getAll() {
    return this.service.getAll();
  }

  @Get(":id")
  @UseGuards(ConsumerGuard)
  async get(@Param("id") id: string) {
    const pack = await this.service.prepare(id as PackageId);

    if (!pack) {
      throw new NotFoundException("Package not found");
    }

    return pack;
  }

  @Post(":id/instances")
  async addInstance(@Param("id") id: string, @Body() body: PackageInstance) {
    return this.service.addInstance(id as PackageId, body);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    await this.service.delete(id as PackageId);

    return;
  }
}
