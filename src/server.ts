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
import { isUserAuthorized, resolversEnhanceMap } from './auth';
import bearerToken from 'express-bearer-token';
import { Role } from './model/enum/role';
import { UserContext } from './model/user-context';

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
    context: ({ req, res }: ExpressContext): UserContext => ({ prisma, req, res })
  });
  await server.start();

  const app = express();
  
  app.use(server.graphqlPath, bearerToken());
  
  server.applyMiddleware({ app });
  await new Promise(resolve => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

startServer();