const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const schema = new mongoose.Schema({
    type: { type: String, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true },
    seen: Date
}, { timestamps: true, strict: false });
schema.plugin(mongooseDelete);
const Notification = mongoose.model('notification', schema);
module.exports = Notification;