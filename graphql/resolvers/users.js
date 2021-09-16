const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const checkAuth = require('../../util/check-auth');
const updateUserData = require('../../util/updateUserData');

function generateToken(res){
    return jwt.sign({
        id: res.id,
        email: res.email,
        verified: res.verified,
        permission: res.permission,
        username: res.username,
        settings: res.settings
    }, SECRET_KEY, { expiresIn: '1h' });
}

module.exports = {
    Mutation: {
        async login(_, { username, password }){
            const { errors, valid } = validateLoginInput(username, password);

            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username });

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong user crendetials';
                throw new UserInputError('Wrong user crendetials', { errors });
            }

            // update userdata if not up-to-date, if failed: return error
            if(!updateUserData(username)) {
                errors.general = 'Failed to bring userdata up-to-date, please report this issue to the developers.';
                throw new UserInputError('Failed to bring userdata up-to-date, please report this issue to the developers.', { errors });
            }

            const token = generateToken(user);

            return{
                ...user._doc,
                id: user._id,
                token
            };
        },
        async register(_, { registerInput : { username, password, confirmPassword, email }}, context, info){
            // Validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
            if(!valid){
                throw new UserInputError('Errors', { errors })
            }

            // Make sure user doesn't already exist
            const user = await User.findOne({ username });
            if (user) {
                throw new UserInputError('Username is taken', {
                errors: {
                    username: 'This username is taken'
                }
                });
            }
            
            // Hash password and create auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),
                verified: false,
                permission: 0,
                settings :{
                    darkMode: false
                }
            });

            // create profile (user's public information)
            const newProfile = new Profile({
                username: username,
                profileIcon: 0,
                profileColor:0,
                verified: false,
                permission: 0,
                balanceHidden: false,
                balance: 100,
                posts: [],
            });

            const res = await newUser.save();
            await newProfile.save();

            const token = generateToken(res);

            return{
                ...res._doc,
                id: res._id,
                token
            };
        },
        async changeProfileIcon(_, { icon }, context){
            const { username } = checkAuth(context);

            if(icon > 101) {
                icon = 101;
            }

            const profile = await Profile.findOneAndUpdate({
                username
            }, {
                profileIcon: icon
            }, {
                useFindAndModify: false,
                upsert: true,
                returnNewDocument: true
            });

            if (!profile) {
                errors.general = 'Profile not found';
                throw new UserInputError('Profile not found', { errors });
            }

            return profile;
        },
        async changeProfileColor(_, { color }, context){
            const { username } = checkAuth(context);

            const profile = await Profile.findOneAndUpdate({
                username
            }, {
                profileColor: color
            }, {
                useFindAndModify: false,
                upsert: true,
                returnNewDocument: true
            });

            if (!profile) {
                errors.general = 'Profile not found';
                throw new UserInputError('Profile not found', { errors });
            }

            return profile;
        }
    },
    Query: {
        async getUserSettings(_, args, context){
            try{
                const { username } = checkAuth(context);

                const { settings } = await User.findOne({ username });

                if(!settings){
                    errors.general = 'User not found';
                    throw new UserInputError('User not found', { errors });
                }

                return settings[0];
            } catch(err){
                throw new Error(err);
            }
        }
    }
}