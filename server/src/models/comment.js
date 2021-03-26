const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const schema = new mongoose.Schema({
    post_id: { type: mongoose.Types.ObjectId, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true },
    reply_to_id: { type: mongoose.Types.ObjectId },
    text: { type: String, required: true },
    seen: Date
}, { timestamps: true });
schema.plugin(mongooseDelete);
const Comment = mongoose.model('comment', schema);
module.exports = Comment;