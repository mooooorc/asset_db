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

import { ConsumerService } from "./consumer.service.js";
import { consumer_schema } from "./consumer.schema.js";
import type { ConsumerId } from "./consumer.domain.js";

import { Roles, RolesGuard } from "../user/auth/roles.guard.js";
import type { PackageId } from "../package/package.domain.js";

import { ConsumerMembershipGuard } from "./membership.guard.js";

@Controller("consumers")
export class ConsumerController {
  constructor(
    @Inject(ConsumerService)
    private readonly service: ConsumerService,

  ) {}

  /**
   * Creates a new Consumer.
   * Only Admins can access this endpoint.
   */
  @Post()
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async create(@Body() body: unknown) {
    const result = consumer_schema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException("Invalid consumer");
    }

    return this.service.save(result.data);
  }

  /**
   * Returns all Consumers.
   * Accessible to Admins, Builders and Viewers.
   */
  @Get()
  async getAll() {
    return this.service.getAll();
  }

  /**
   * Returns a Consumer by ID.
   * Accessible to Admins, Builders and Viewers.
   */
  @Get(":id")
  async get(@Param("id") id: string) {
    const consumer = await this.service.get(id as ConsumerId);

    if (!consumer) {
      throw new NotFoundException("Consumer not found");
    }

    return consumer;
  }

  /**
   * Returns the Packages linked to a Consumer.
   *
   * Accessible to Admins, Builders and Viewers.
   */
  @Get(":id/packages")
  async getLinkedPackages(@Param("id") id: string) {
    return this.service.getLinkedPackages(id as ConsumerId);
  }

  /**
   * Deletes a Consumer by ID.
   * Only Admins can access this endpoint.
   */
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles("Admin")
  async delete(@Param("id") id: string) {
    await this.service.delete(id as ConsumerId);

    return;
  }

  /**
   * Links a Package to a Consumer.
   *
   * Only Consumer Managers can access this endpoint.
   */
  @Post(":consumerId/packages/:packageId")
@UseGuards(ConsumerMembershipGuard)
async linkPackageToConsumer(
  @Param("consumerId") consumerId: string,
  @Param("packageId") packageId: string,
) {
  await this.service.linkPackageToConsumer(
    consumerId as ConsumerId,
    packageId as PackageId,
  );

  return;
}

  /**
   * Unlinks a Package from a Consumer.
   *
   * Only Consumer Managers can access this endpoint.
   */
  @Delete(":consumerId/packages/:packageId")
@UseGuards(ConsumerMembershipGuard)
async unlinkPackageFromConsumer(
  @Param("consumerId") consumerId: string,
  @Param("packageId") packageId: string,
) {
  await this.service.unlinkPackageFromConsumer(
    consumerId as ConsumerId,
    packageId as PackageId,
  );

  return;
}
}
