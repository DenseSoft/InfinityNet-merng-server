const { model, Schema } = require('mongoose');

const profileSchema = new Schema({
    username: String,
    profileIcon: Number, 
    profileColor: Number,
    verified: Boolean,
    permission: Number,
    balanceHidden: Boolean,
    balance: Number,
    posts: [String]
})

module.exports = model('Profile', profileSchema);