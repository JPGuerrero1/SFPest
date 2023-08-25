const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Service = require("./models/service");
const app = express();

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
                return Service.find()
                .then(services => {
                    return services.map(service => {
                        return {...service._doc};
                    });
                })
                .catch(err => {
                    throw err;
                });
            },

            createServices: args => {
               const service = new Service({
                title: args.serviceInput.title,
                description: args.serviceInput.description,
                price: +args.serviceInput.price,
                date: new Date(args.serviceInput.date)
               });
               return service
               .save()
               .then(result => {
                console.log(result);
                return {...result._doc};
               })
               .catch(err => {
                console.log(err);
                throw err;
               });
            }
        },
        graphiql: true
    })
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD
}@sfenvironmental.eh1ptyz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
