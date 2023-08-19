const { trusted } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {
    AuthenticationError,
    ForbiddenError
} = require('apollo-server-express');
const gravatar = require('../util/gravatar');
module.exports = {
        newNote: async (parent, args, {models, user})=>{
            if(!user){
                throw new AuthenticationError('You must be signed in to create a note')
            }
            const note = {
                content: args.content,
                author: new mongoose.Types.ObjectId(user.id)
            };
            return await models.Note.create(note);
        },
        updateNote: async (parent, args, {models})=>{
            return await models.Note.findOneAndUpdate({_id: args.id}, { $set: { content: args.content }},{new: true})
        },
        deleteNote: async (parent, args, {models})=>{
            let result = false;
            await models.Note.deleteOne({_id: args.id}).then(r=>result = true).catch(err=> result = false)
            return result 
        },
        signUp: async (parents, {username, password, email}, {models})=>{
            const emailNormalise = email.trim().toLowerCase();
            const hash = await bcrypt.hash(password, 10);
            let avatar = gravatar(emailNormalise);
            try{
                const user = await models.User.create({
                    username,
                    email: emailNormalise,
                    avatar,
                    password: hash,
                });
                return jwt.sign({id: user._id}, process.env.JWT_SECRET);
            } catch(err){
                console.log(err);
                throw new Error('User not create to DB!!!');
            }
        },
        signIn: async (parents, {username, password, email}, {models})=>{
            const emailNormalise = email.trim().toLowerCase();
            let user = await models.User.findOne({$or: [{username},{emailNormalise}]});
            if(!user) throw new Error('User not find!');
            let validate = await bcrypt.compare(password, user.password);
            if(!validate){
                throw new AuthenticationError('Password not correct!!');
            } else{
                return jwt.sign({id: user._id}, process.env.JWT_SECRET);
            }
        },
        toggleFavorite: async(parents, args, {models, user})=>{
            if(!user) throw new AuthenticationError('no user');
            let {favoriteCount, favoritedBy} = await models.Note.findById(args.id);
            if(favoritedBy.includes(user.id)){
                favoritedBy.splice(favoritedBy.indexOf(user.id),1);
                return await models.Note.findOneAndUpdate({_id: args.id}, { $set: { favoriteCount: favoriteCount-1<0?0:favoriteCount-1, favoritedBy}},{new: true});
            } else{
                favoritedBy.push(user.id);
                return await models.Note.findOneAndUpdate({_id: args.id}, { $set: { favoriteCount: favoriteCount+1, favoritedBy}},{new: true});
            }
        }

};