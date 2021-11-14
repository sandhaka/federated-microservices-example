import {ApolloServer, gql} from "apollo-server";
import {buildFederatedSchema} from "@apollo/federation";
import fetch from 'node-fetch';

const port = 4003;
const apiUrl = "http://localhost:3000";

const typeDefs = gql`
    type Account @key(fields: "id") {
        id: ID!
        number: Int
        balance: Float
        currency: String
    }
    
    extend type Query {
        account(id: ID!): Account
        accounts: [Account]
    }
`;

const resolvers = {
    Account: {
        __resolveReference(ref) {
            return fetch(`${apiUrl}/accounts/${ref.id}`).then(res => res.json());
        }
    },
    Query: {
        account(_, { id }) {
            return fetch(`${apiUrl}/accounts/${id}`).then(res => res.json());
        },
        accounts() {
            return fetch(`${apiUrl}/accounts`).then(res => res.json());
        }
    }
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
    console.log(`Accounts service ready at ${url}`);
});