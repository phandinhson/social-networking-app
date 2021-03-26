const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    from_id: { type: mongoose.Types.ObjectId, required: true },
    to_id: { type: mongoose.Types.ObjectId, required: true },
    text: { type: String, required: true },
    seen: Date
}, { timestamps: true });
const Message = mongoose.model('message', schema);
module.exports = Message;