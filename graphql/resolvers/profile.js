const Profile = require('../../models/Profile');
const { UserInputError } = require('apollo-server');

module.exports = {
    Query: {
        async getProfile(_, { username }){
            const profile = await Profile.findOne({ username });

            if(!profile){
                throw new UserInputError('Profile not found');
            }
            return profile;
        }
    }
}