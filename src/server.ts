import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';
import { 
  CreateUserResolver,
  FindManyUserResolver,
  FindUniqueUserResolver,
  DeleteUserResolver,
  UserRelationsResolver,
  applyResolversEnhanceMap,
} from '@generated/type-graphql';
import { Authorized, buildSchema } from  'type-graphql';
const express = require('express');
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import { Context } from 'node:vm';
import { getUserInfo, isUserAuthorized, resolversEnhanceMap } from './auth';
import { Role } from './model/enum/role';
import { UserContext } from './model/user-context';
import jwt_decode from 'jwt-decode';

const prisma = new PrismaClient();

applyResolversEnhanceMap(resolversEnhanceMap);

async function startServer() {
  const schema = await buildSchema({
    resolvers: [
      CreateUserResolver,
      DeleteUserResolver,
      FindManyUserResolver,
      FindUniqueUserResolver,
      UserRelationsResolver,
    ],
    validate: false,
    authChecker: isUserAuthorized,
  });

  const server = new ApolloServer({ 
    schema,
    context: ({ req, res }: ExpressContext): UserContext => {
      const authHeader = req.headers.authorization || '';
      const user = getUserInfo(authHeader);
      return { prisma, req, res, user }
    }
  });
  await server.start();

  const app = express();
  
  server.applyMiddleware({ app });
  await new Promise(resolve => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

startServer();