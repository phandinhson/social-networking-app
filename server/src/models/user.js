const mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: String,
    bio: String,
    lastActive: Date,
    roles: [String]
});
const User = mongoose.model('User', userSchema);

const localAccountSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
});
localAccountSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});
localAccountSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};
const LocalUser = User.discriminator('LocalUser', localAccountSchema);

const GoogleUser = User.discriminator('GoogleUser', new mongoose.Schema({
    googleId: { type: String, required: true, index: { unique: true } }
}));

module.exports = { User, LocalUser, GoogleUser };