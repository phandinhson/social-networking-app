const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const schema = new mongoose.Schema({
    post_id: { type: mongoose.Types.ObjectId, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true },
    reason: String
}, { timestamps: true, strict: false });
schema.plugin(mongooseDelete);
const ReportedPost = mongoose.model('reported_post', schema);
module.exports = ReportedPost;