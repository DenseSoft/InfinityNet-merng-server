const postsResolvers = require('./posts');
const usersResolvers = require('./users');
const commentResolvers = require('./comments');
const likesResolvers = require('./likes');
const profileResolvers = require('./profile');
const fileResolvers = require('./files');

module.exports = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length
    },
    Comment: {
        likeCount: (parent) => parent.likes.length,
        replyCount: (parent) => parent.replies.length
    },
    Reply: {
        likeCount: (parent) => parent.likes.length
    },
    Query: {
        ...postsResolvers.Query,
        ...usersResolvers.Query,
        ...profileResolvers.Query,
        ...fileResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...likesResolvers.Mutation,
        ...fileResolvers.Mutation
    },
    Subscription: {
        ...postsResolvers.Subscription
    }
}