import { ForbiddenException, Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from "@nestjs/common";
import type { ConsumerId } from "./consumer.domain.js";
import { user_has_consumer_membership } from "./operations/user_has_membership.js";

@Injectable()
export class ConsumerMembershipGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    const consumerId = request.params.consumerId as ConsumerId;

    const hasMembership = await user_has_consumer_membership(
      user.id,
      consumerId,
      "Manager",
    );

    if (!hasMembership) {
      throw new ForbiddenException();
    }

    return true;
  }
}