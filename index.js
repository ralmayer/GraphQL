const { graphql, buildSchema } = require("graphql");

const db = {
    users: [
        {id: 1, name: 'Alex', email: 'alex@gmail.com'},
        {id: 2, name: 'Greg', email: 'greg@gmail.com'}
    ]
}

const schema = buildSchema(`   
    type Query {
        users: [User!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        avatarUrl: String
    }
`);

const rootValue = {
    users: () => db.users
}

graphql(
    schema, 
    `
    {
        users {
            email
        }
    }
    `, 
    rootValue
).then( 
    res => console.dir(res, { depth: null })
).catch(
    console.log('smth went wrong')
)
