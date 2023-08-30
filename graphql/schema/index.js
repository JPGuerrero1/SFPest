const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type Booking {
        _id: ID!
        event: Service!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

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
        bookings: [Booking!]!
    }

    type RootMutation {
        createServices(serviceInput: ServiceInput): Service
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Service!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);