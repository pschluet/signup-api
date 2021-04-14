"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express = require("express");
const apollo_server_express_1 = require("apollo-server-express");
async function startServer() {
    const typeDefs = apollo_server_express_1.gql `
    typee Query {
      hello: String
    }
  `;
    const resolvers = {
        Query: {
            hello: () => 'Hello',
        }
    };
    const server = new apollo_server_express_1.ApolloServer({ typeDefs, resolvers });
    await server.start();
    const app = express();
    server.applyMiddleware({ app });
    await new Promise(resolve => app.listen({ port: 4000 }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    return { server, app };
}
