let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {unique: true}
    },
    email:{
        type: String,
        required: true,
        index: {unique: true}
    },
    avatar:{
        type: String,
    },
    password:{
        type: String,
        required: true
    },
    favorites:[{
        type: mongoose.Types.ObjectId,
        ref: "Note"
        }]
},{timestamps: true});
let User = mongoose.model('User', userSchema);
module.exports = User;