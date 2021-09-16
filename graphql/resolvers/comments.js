const { AuthenticationError, UserInputError } = require('apollo-server');

const User = require('../../models/User');
const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Mutation: {
        async createComment(_, { postId, body }, context){
            const { username } = checkAuth(context);
            
            if(body.trim() == ''){
                throw new UserInputError('Empty comment', { 
                    errors: {
                        body: 'Comment must not be empty'
                    }
                })
            }

            const post = await Post.findById(postId);

            if(post){
                post.comments.unshift({
                    username,
                    body,
                    createdAt: new Date().toISOString(),
                })

                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        },
        async deleteComment(_, { postId, commentId }, context){
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if(post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId);

                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } else {
                throw new UserInputError('Post not found');
            }
        },
        async createReply(_, { postId, commentId, body }, context){
            const { username } = checkAuth(context);
            
            if(body.trim() == ''){
                throw new UserInputError('Empty comment', { 
                    errors: {
                        body: 'Comment must not be empty'
                    }
                })
            }

            const post = await Post.findById(postId);
            const commentIndex = post.comments.findIndex(c => c.id === commentId);

            if(post){
                post.comments[commentIndex].replies.unshift({
                    username,
                    body,
                    createdAt: new Date().toISOString(),
                })

                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        },
        async deleteReply(_, { postId, commentId, replyId }, context){
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if(post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId);
                const replyIndex = post.comments[commentIndex].replies.findIndex(r => r.id === replyId);

                if(post.comments[commentIndex].replies[replyIndex].username === username){
                    post.comments[commentIndex].replies.splice(replyIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
}