import {ApolloGateway, RemoteGraphQLDataSource} from "@apollo/gateway";
import {ApolloServer} from "apollo-server";
import {HandleAuth} from "./handleAuth.mjs";

const gateway = new ApolloGateway({
    serviceList: [
        {name: 'persons', url: 'http://localhost:4001'},
        {name: 'relationships', url: 'http://localhost:4002'},
        {name: 'accounts', url: 'http://localhost:4003'},
        {name: 'deposits', url: 'http://localhost:5068/graphql'}
    ],
    buildService({name, url}) {
        return new RemoteGraphQLDataSource({
            url,
            willSendRequest({request, context}) {
                request.http.headers.set('authorization', context.payload);
            }
        });
    }
});

const auth = new HandleAuth();
const apollo = new ApolloServer({
    gateway: gateway,
    context: auth.handle,
    subscriptions: false
});

apollo.listen({port: 4000, cors: { origin: '*' }}).then(({url}) => {
    console.log(`Server ready at ${url}`);
});