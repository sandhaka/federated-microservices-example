import {ApolloServer, gql} from "apollo-server";
import {buildFederatedSchema} from "@apollo/federation";
import fetch from 'node-fetch';

const port = 4002;
const apiUrl = "http://localhost:3000";

const typeDefs = gql`
    type Relationship @key(fields: "id"){
        id: ID!
        number: Int
        accounts: [Account]
        deposits: [Deposit]
    }
    
    extend type Account @key(fields: "id") {
        id: ID! @external
        relationship: Relationship
    }

    extend type Deposit @key(fields: "id") {
        id: Int! @external
        relationship: Relationship
    }
    
    extend type Query {
        relationship(id: ID!): Relationship
        relationships: [Relationship]
    }
`;

const resolvers = {
    Account: {
        async relationship(account) {
            const res = await fetch(`${apiUrl}/relationships`);
            const relationships = await res.json();
            return relationships.find(r =>
                r.accounts.includes(parseInt(account.id))
            );
        }
    },
    Relationship: {
        __resolveReference(ref) {
            return fetch(`${apiUrl}/relationships/${ref.id}`).then(res => res.json());
        },
        accounts(relationship) {
            return relationship.accounts.map(id => ({ __typename: "Account", id }));
        },
        deposits(relationship) {
            return relationship.deposits.map(id => ({ __typename: "Deposit", id }));
        }
    },
    Query: {
        relationship(_, {id}) {
            return fetch(`${apiUrl}/relationships/${id}`).then(res => res.json());
        },
        relationships() {
            return fetch(`${apiUrl}/relationships`).then(res => res.json());
        }
    }
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
    console.log(`Relationships service ready at ${url}`);
});