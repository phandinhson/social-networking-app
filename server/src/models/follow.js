const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const schema = new mongoose.Schema({
    follower_id: { type: mongoose.Types.ObjectId, required: true },
    following_id: { type: mongoose.Types.ObjectId, required: true },
    seen: Date
}, { timestamps: true });
schema.plugin(mongooseDelete);
const Follow = mongoose.model('follow', schema);
module.exports = Follow;