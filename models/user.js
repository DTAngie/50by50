const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userAttrSchema = new Schema({
    city: String,
    state: String,
    displayName: String,
}, {
    timestamps: true,
})

const userSchema = new Schema({
    name: String,
    email: String,
    googleId: String,
    attr: [userAttrSchema],
}, {
    timestamps: true
});


module.exports = mongoose.model('User', userSchema);