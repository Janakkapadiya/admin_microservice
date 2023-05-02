import { Role } from '../../../../../libs/shared/src/domain/enums/Roles.enum';

export class UserWithoutPassword {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export class UserM extends UserWithoutPassword {
  password: string;
}
