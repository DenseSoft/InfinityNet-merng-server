const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getPosts(_, { sortType }){
            try{
                if(!sortType){
                    const posts = await Post.find().sort({ createdAt: -1 });
                    return posts;
                } else if(sortType === 0) {
                    // recent
                    const posts = await Post.find().sort({ createdAt: -1 });
                    return posts;
                } else if(sortType === 1) {
                    // top (based on likes)
                    const posts = await Post.find().sort({ likes: -1 });
                    return posts;
                } else if(sortType === 2) {
                    // Best
                    const posts = await Post.find().sort({ comments: -1 });
                    return posts;
                } else {
                    throw new Error(err);
                }
            } catch(err){
                throw new Error(err);
            }
        },
        async getPost(_, { postId }){
            try{
                const post = await Post.findById(postId);
                if (post){
                    return post;
                } else {
                    throw new Error('Post not found');
                }
            } catch(err){
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createPost(_, { body }, context){
            const user = checkAuth(context);

            if(body.trim() === ''){
                throw new UserInputError('Post body must not be empty')
            }
            
            const newPost = new Post({
                body,
                user: user.indexOf,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();

            // Publish post to subscribers
            context.pubsub.publish('NEW_POST', {
                newPost: post
            })

            return post;
        },
        async deletePost(_, { postId }, context){
            const user = checkAuth(context);

            try{
                const post = await Post.findById(postId);
                if(user.username === post.username){
                    await post.delete();
                    return 'Post Deleted succesfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch(err){
                throw new Error(err);
            }
        }
    },
    Subscription: {
        newPost: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
        }
    }
}