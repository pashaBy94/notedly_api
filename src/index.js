
let express = require('express');
let helmet = require('helmet');
let cors = require('cors');
let app = express();
app.use(helmet());
app.use(cors());

require('dotenv').config();

let db = require('./db');
let DB_HOST = process.env.DB_HOST;
db.connect(DB_HOST);

let depthLimit = require('graphql-depth-limit');
let { createComplexityLimitRule } = require('graphql-validation-complexity');

let { ApolloServer } = require('apollo-server-express');
let models = require('./models');
let typeDefs = require('./schema');
let resolvers = require('./resolvers/index');
const server = new ApolloServer({
    typeDefs, 
    resolvers, 
    validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
    context: ({ req })=>{
        let token = req.headers.authorization;
        let user = getUser(token);
        console.log(token, user);
        return { models, user }
    }
});
server.applyMiddleware({app, path: '/api'});

let jwt = require('jsonwebtoken');
function getUser (token){
if(token){
    try{
        let user = jwt.verify(token, process.env.JWT_SECRET);
        return user
    }catch(err){
        new Error('Session invalid')
    }
}
}

let port = process.env.PORT || 4000;
app.listen({ port }, ()=>console.log(`GraphGL server running at http://localhost:${port}${server.graphqlPath}`));