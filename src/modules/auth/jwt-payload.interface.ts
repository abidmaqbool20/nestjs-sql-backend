import { Role } from "../roles/entities/role.entity";

export interface JwtPayload {
  username: object;
  sub: string;
  roles: Role[]
}