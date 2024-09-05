// permissions.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const AppPermissions = (...permissions: string[]) => SetMetadata('permissions', permissions);
