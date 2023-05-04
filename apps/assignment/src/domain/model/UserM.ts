import { Role } from '@app/shared/domain/enums/Roles.enum';

export class UserWithoutPassword {
  id: number;
  email: string;
  name: string;
  role: Role;
}

export class UserM extends UserWithoutPassword {
  password: string;
}

export class OrderM {
  item: string;
  amount: number;
}
