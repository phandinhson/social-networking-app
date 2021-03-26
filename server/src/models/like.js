const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const schema = new mongoose.Schema({
    post_id: { type: mongoose.Types.ObjectId, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true },
    seen: Date
}, { timestamps: true });
schema.plugin(mongooseDelete);
const Like = mongoose.model('like', schema);
module.exports = Like;