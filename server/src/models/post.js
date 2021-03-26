const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const schema = new mongoose.Schema({
    text: String,
    files: [{
        filename: { type: String, required: true },
        mimetype: { type: String, required: true }
    }],
    tags: [String],
    user_id: { type: mongoose.Types.ObjectId, required: true }
}, { timestamps: true });
schema.pre('validate', function (next) {
    if ((!this.text || !this.text.trim()) && (!this.files || this.files.length == 0)) {
        return next(new Error('posts must have text or files'));
    }
    next();
});
schema.plugin(mongooseDelete);
const Post = mongoose.model('post', schema);
module.exports = Post;