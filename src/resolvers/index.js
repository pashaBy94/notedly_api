let Query = require('./query');
let Mutation = require('./mutation');
let Note = require('./note');
let User = require('./user');
let { GraphQLDateTime } = require('graphql-iso-date');
let resolvers = {
    Query,
    Mutation,
    Note,
    User,
    DateTime: GraphQLDateTime
};
module.exports = resolvers;