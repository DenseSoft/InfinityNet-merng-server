const{ model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    verified: Boolean,
    permission: Number,
    settings: [
        {
            darkMode: Boolean
        }
    ]
});

module.exports = model('User', userSchema);