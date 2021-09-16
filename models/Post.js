const { model, Schema } = require('mongoose');

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    postType: String,
    url: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String,
            likes: [
                {
                    username: String,
                    createdAt: String
                }
            ],
            replies: [
                {
                    username: String,
                    createdAt: String,
                    body: String,
                    likes: [
                        {
                            username: String,
                            createdAt: String 
                        }
                    ]
                }
            ]
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
})

module.exports = model('Post', postSchema);