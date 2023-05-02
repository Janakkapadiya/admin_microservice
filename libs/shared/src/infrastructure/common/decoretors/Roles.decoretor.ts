import { SetMetadata } from '@nestjs/common';
import { Role } from '@app/shared/domain/enums/Roles.enum';

export const Roles = (...role: Role[]) => SetMetadata('role', role);
