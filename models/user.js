const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: String,
    active: Boolean,
    avatar: String,
    denuncias: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "denuncias",
        }
    ],
    
});

module.exports = mongoose.model('user', UserSchema);