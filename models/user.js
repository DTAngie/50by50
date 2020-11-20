const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    city: String,
    state: String,
    googleID: String,
    races: [{type: Schema.Types.ObjectId, ref: 'Race'}],
}, {
    timestamps: true
})