const User = require('../models/User');
const Profile = require('../models/Profile');

module.exports = async function updateUserData(username) {
    // code for newest userData here

    const user = await User.findOne({ username });
    const { settings } = await User.findOne({ username });

    // check if profile already has been created
    const userProfile = await Profile.findOne({username});

    if (!userProfile) {
        try {
            const newProfile = new Profile({
                username: username,
                profileIcon: settings[0].profileIcon,
                profileColor: settings[0].profileColor,
                verified: user.verified,
                permission: user.permission,
                balanceHidden: false,
                balance: 100,
                posts: [],
            });
            
            await newProfile.save();
            return true;
        } catch(err) {
            throw new Error(err);
        }
    }

    return true;
}