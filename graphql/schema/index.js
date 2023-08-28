const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Service {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        appointments: [Service!]
    }

    input ServiceInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type RootQuery {
        services: [Service!]!
    }

    type RootMutation {
        createServices(serviceInput: ServiceInput): Service
        createUser(userInput: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);