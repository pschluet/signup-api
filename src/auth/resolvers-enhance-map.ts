import { Authorized } from 'type-graphql';
import { ResolversEnhanceMap } from '@generated/type-graphql';
import { Role } from '../model/enum/role';

// Authorization guards for resolvers
export const resolversEnhanceMap: ResolversEnhanceMap = {
  User: {
    createUser: [Authorized(Role.Admin)],
    deleteUser: [Authorized(Role.Admin)],
    user: [Authorized()],
    users: [Authorized()],
  },
};
