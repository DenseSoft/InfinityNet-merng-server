const { UserInputError } = require('apollo-server');

const checkAuth = require('../../util/check-auth');
const Post = require('../../models/Post');

module.exports = {
    Mutation: {
        async likePost(_, { postId }, context){
            const { username } = checkAuth(context);

            if(!postId){
                throw new UserInputError('postId must not be empty');
            }
            const post = await Post.findById(postId);
            if(post){
                if(post.likes.find(like => like.username === username)){
                    // Post already liked by user -> unlike

                    post.likes = post.likes.filter(like => like.username !== username);
                } else {
                    // Post not liked by user yet -> like

                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });
                }

                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        },
        async likeComment(_, { postId, commentId }, context){
            const { username } = checkAuth(context);

            if(!postId){
                throw new UserInputError('postId must not be empty');
            }
            if(!commentId){
                throw new UserInputError('commentId must not be empty');
            }
            const post = await Post.findById(postId);
            const commentIndex = post.comments.findIndex(c => c.id === commentId);

            if(post){
                if(post.comments[commentIndex].likes.find(like => like.username === username)){
                    // Post already liked by user -> unlike

                    post.comments[commentIndex].likes = post.comments[commentIndex].likes.filter(like => like.username !== username);
                } else {
                    // Post not liked by user yet -> like

                    post.comments[commentIndex].likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });
                }

                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        },
        async likeReply(_, { postId, commentId, replyId }, context){
            const { username } = checkAuth(context);

            if(!postId){
                throw new UserInputError('postId must not be empty');
            }
            if(!commentId){
                throw new UserInputError('commentId must not be empty');
            }
            if(!replyId){
                throw new UserInputError('replyId must not be empty');
            }
            const post = await Post.findById(postId);
            const commentIndex = post.comments.findIndex(c => c.id === commentId);
            const replyIndex = post.comments[commentIndex].replies.findIndex(r => r.id === replyId);

            if(post){
                if(post.comments[commentIndex].replies[replyIndex].likes.find(like => like.username === username)){
                    // Post already liked by user -> unlike

                    post.comments[commentIndex].replies[replyIndex].likes = post.comments[commentIndex].replies[replyIndex].likes.filter(like => like.username !== username);
                } else {
                    // Post not liked by user yet -> like

                    post.comments[commentIndex].replies[replyIndex].likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    });
                }

                await post.save();
                return post;
            } else {
                throw new UserInputError('Post not found');
            }
        }
    }
}