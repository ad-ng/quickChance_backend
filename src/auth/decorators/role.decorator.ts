// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { RoleStatus } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleStatus[]) => SetMetadata(ROLES_KEY, roles);
