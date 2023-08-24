const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

const serviceGlobal = [];

app.use(bodyParser.json());

app.use('/graphql',
    graphqlHTTP({
        schema: buildSchema(`
            type Service {
                _id: ID!
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type RootQuery {
                services: [Service!]!
            }

            input ServiceInput {
                title: String!
                description: String!
                price: Float!
                date: String!
            }

            type RootMutation {
                createServices(serviceInput: ServiceInput): Service
            }

            schema {
                query: RootQuery
                mutation: RootMutation
            }
        `),

        rootValue: {
            services: () => {
                return serviceGlobal;
            },

            createServices: args => {
               const service = {
                _id: Math.random().toString(),
                title: args.serviceInput.title,
                description: args.serviceInput.description,
                price: +args.serviceInput.price,
                date: args.serviceInput.date
               };
               serviceGlobal.push(service);
               return service;
            }
        },
        graphiql: true
    })
);

app.listen(3000);