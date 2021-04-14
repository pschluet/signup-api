import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';
import { resolvers } from '@generated/type-graphql';
import { buildSchema } from  'type-graphql';
const express = require('express');
import { ApolloServer, gql } from 'apollo-server-express';
import { Context } from 'node:vm';

const prisma = new PrismaClient();

async function startServer() {
  const schema = await buildSchema({
    resolvers,
    validate: false
  });

  const server = new ApolloServer({ 
    schema,
    playground: true,
    context: (): Context => ({ prisma })
  });
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  await new Promise(resolve => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}

startServer();