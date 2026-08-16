import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required user roles for a route or controller.
 * @param roles Array of role names, e.g. 'admin', 'participant'
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
