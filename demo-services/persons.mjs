import {ApolloServer, gql} from "apollo-server";
import {buildFederatedSchema} from "@apollo/federation";
import fetch from 'node-fetch';

const port = 4001;
const apiUrl = "http://localhost:3000";

const typeDefs = gql`
    type Person {
        id: ID!
        name: String
        relationships: [Relationship]
    }
    
    extend type Relationship @key(fields: "id") {
        id: ID! @external
        persons: [Person]
    }
    
    extend type Query {
        person(id: ID!): Person
        persons: [Person]
    }
`;

const resolvers = {
    Relationship: {
        async persons(relationship) {
            const res = await fetch(`${apiUrl}/persons`);
            const persons = await res.json();
            return persons.filter(({relationships}) =>
                relationships.includes(parseInt(relationship.id))
            );
        }
    },
    Person: {
        relationships(person) {
            return person.relationships.map(id => ({ __typename: "Relationship", id }));
        }
    },
    Query: {
        person(_, {id}) {
            return fetch(`${apiUrl}/persons/${id}`).then(res => res.json());
        },
        persons() {
            return fetch(`${apiUrl}/persons`).then(res => res.json());
        }
    }
}

const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port }).then(({ url }) => {
    console.log(`Persons service ready at ${url}`);
});