const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const crypto = require('crypto')

const app = express()

const db = {
    users: [
        {id: "1", name: 'Alex', email: 'alex@gmail.com'},
        {id: "2", name: 'Greg', email: 'greg@gmail.com'}
    ],
    messages: [
        {id: "1", userId: "1", body: "Hey", createdAt: Date.now()},
        {id: "2", userId: "2", body: "Aye", createdAt: Date.now()},
        {id: "3", userId: "1", body: "What's up?", createdAt: Date.now()}
    ]
}

class User {
    constructor(user) {
        Object.assign(this, user)
    }

    messages () {
        return db.messages.filter(message => message.userId === this.id)
    }
}

const schema = buildSchema(`   
    type Query {
        users: [User!]!
        user(id: ID!): User
        messages: [Message!]!
    }

    type Mutation {
        addUser(email: String!, name: String): User
    }

    type User {
        id: ID!
        name: String
        email: String!
        avatarUrl: String
        messages: [Message!]!
    }

    type Message {
        id: ID!
        body: String!
        createdAt: String
    }
`);

const rootValue = {
    users: () => db.users.map(user => new User(user)),
    user: args => db.users.find(user => user.id === args.id),
    messages: () => db.messages,
    addUser: ({email, name}) => {
        const user = {
            id: crypto.randomBytes(10).toString('hex'),
            email,
            name
        }

        db.users.push(user)

        return user
    }
}

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true
}))

app.listen(5000, () => console.log('Listening on port 5000'))

// graphql(
//     schema, 
//     `
//     {
//         users {
//             email
//         }
//     }
//     `, 
//     rootValue
// ).then( 
//     res => console.dir(res, { depth: null })
// ).catch(
//     console.log('smth went wrong')
// )
