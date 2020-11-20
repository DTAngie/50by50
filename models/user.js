const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    city: String,
    state: String,
    googleId: String,
    races: [{type: Schema.Types.ObjectId, ref: 'Race'}],
    displayName: String,
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);