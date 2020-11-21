const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userRacesSchema = new Schema({
    race: {type: Schema.Types.ObjectId, ref: 'Race'},
    time: Number //this is the race in seconds
}, {
    timestamps: true
});

const userSchema = new Schema({
    name: String,
    email: String,
    city: String,
    state: String,
    googleId: String,
    displayName: String,
    races: [userRacesSchema],
}, {
    timestamps: true
});


module.exports = mongoose.model('User', userSchema);