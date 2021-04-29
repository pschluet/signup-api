import { Role } from './enum/role';

export interface UserInfo {
  roles: Role[];
  id: string;
}
