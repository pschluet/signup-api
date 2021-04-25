import  Verifier from 'verify-cognito-token';
import { Request, Response, NextFunction } from 'express';
import { AuthChecker, Authorized } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { UserContext } from './model/user-context';
import { 
  ResolversEnhanceMap,
} from '@generated/type-graphql';
import { Role } from './model/enum/role';

export const isCognitoTokenValid = async (req: Request): Promise<boolean> => {
  if (!req.token) {
    return false;
  }

  const verifier = new Verifier({
    region: 'us-east-1',
    userPoolId: 'us-east-1_hJrsBJIE5',
  });

  return await verifier.verify(req.token);
};

export const isUserAuthorized: AuthChecker<UserContext> = async (
  { root, args, context, info },
  requiredRoles: string[]
) => {
  // TODO: check roles
  return await isCognitoTokenValid(context.req);
}

export const resolversEnhanceMap: ResolversEnhanceMap = {
  User: {
    createUser: [Authorized(Role.Admin)],
    deleteUser: [Authorized(Role.Admin)],
    user: [Authorized()],
    users: [Authorized()],
  },
}