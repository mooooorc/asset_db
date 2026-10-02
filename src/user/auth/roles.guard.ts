import { ForbiddenException, Inject, Injectable, SetMetadata, type CanActivate, type ExecutionContext } from "@nestjs/common";
import type { User, UserRole } from "../user.domain.js";
import { Reflector } from "@nestjs/core";


export const ROLES_KEY = "roles";

export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector
) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as User | undefined;

    if (!user || !roles.includes(user.role)) {
      throw new ForbiddenException();
    }

    return true;
  }
}