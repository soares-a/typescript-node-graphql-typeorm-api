import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { createConnection } from 'typeorm';

// Definindo o schema GraphQL
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
  }
`;

// Resolvers GraphQL
const resolvers = {
  Query: {
    users: async () => {
      // Implemente a lógica para retornar os usuários do banco de dados usando o TypeORM
      const users = await User.find();
      return users;
    },
  },
};

async function startServer() {
  const app = express();

  // Configuração do TypeORM
  await createConnection({
    type: 'your-database-type',
    host: 'your-database-host',
    port: 5432, // ou a porta do seu banco de dados
    username: 'your-database-username',
    password: 'your-database-password',
    database: 'your-database-name',
    entities: [User], // Importe suas entidades do TypeORM aqui
    synchronize: true, // Sincroniza automaticamente as entidades com o banco de dados
  });

  const server = new ApolloServer({ typeDefs, resolvers });

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();
