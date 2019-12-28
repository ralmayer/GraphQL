const express = require('express')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')
const crypto = require('crypto')

const app = express()

const db = {
    users: [
        {id: "1", name: 'Alex', email: 'alex@gmail.com'},
        {id: "2", name: 'Greg', email: 'greg@gmail.com'}
    ]
}

const schema = buildSchema(`   
    type Query {
        users: [User!]!
        user(id: ID!): User
    }

    type Mutation {
        addUser(email: String!, name: String): User
    }

    type User {
        id: ID!
        name: String
        email: String!
        avatarUrl: String
    }
`);

const rootValue = {
    users: () => db.users,
    user: args => db.users.find(user => user.id === args.id),
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
