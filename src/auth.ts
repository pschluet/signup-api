import  Verifier from 'verify-cognito-token';
import { Request, Response, NextFunction } from 'express';
import { AuthChecker, Authorized } from 'type-graphql';
import { PrismaClient } from '@prisma/client';
import { UserContext } from './model/user-context';
import { 
  ResolversEnhanceMap,
} from '@generated/type-graphql';
import { Role } from './model/enum/role';
import { UserInfo } from './model/user-info';
import jwt_decode from 'jwt-decode';

export const isCognitoTokenValid = async (req: Request): Promise<boolean> => {
  if (!req.headers.authorization) {
    return false;
  }
  const tokenParts = req.headers.authorization.split('Bearer ');
  if (tokenParts.length != 2) { return false; }

  const verifier = new Verifier({
    region: 'us-east-1',
    userPoolId: 'us-east-1_hJrsBJIE5',
  });
  return await verifier.verify(tokenParts[1]);
};

export const isUserAuthorized: AuthChecker<UserContext> = async (
  { root, args, context, info },
  requiredRoles: string[]
) => {
  return await isCognitoTokenValid(context.req) &&
    requiredRoles.every(requiredRole => 
      context.user.roles.includes(requiredRole)
    );
}

export const getUserInfo = (authHeader: string): UserInfo => {  
  try {
    const decodedToken: any = jwt_decode(authHeader);
    return {
      roles: 'cognito:groups' in decodedToken ? decodedToken['cognito:groups'] : [],
      id: 'id' in decodedToken ? decodedToken['id'] : '',
    }
  }
  catch (e) {
    return {
      roles: [],
      id: ''
    };
  }
  
}

export const resolversEnhanceMap: ResolversEnhanceMap = {
  User: {
    createUser: [Authorized(Role.Admin)],
    deleteUser: [Authorized(Role.Admin)],
    user: [Authorized()],
    users: [Authorized()],
  },
}