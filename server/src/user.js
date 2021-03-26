const express = require('express');
const { User } = require('./models/user');
const multer = require('multer');

module.exports = io => {
    const app = express.Router();
    const upload = multer({ dest: `${__dirname}/../images` });
    app
        .get('/:id', async (req, res, next) => {
            User.findById(req.params.id)
                .then(res.json.bind(res))
                .catch(next);
        })
        .get('/', (req, res) => {
            User
                .aggregate([
                    { $project: { name: { $concat: ['$firstName', ' ', '$lastName'] } } },
                    {
                        $match: {
                            name: { $regex: `^${req.query.q}`, $options: 'i' },
                            _id: { $ne: req.user._id }
                        }
                    },
                    { $sort: { _id: 1 } }
                ])
                .then(result => res.json(result));
        })
        .put('/', upload.single('avatar'), (req, res, next) => {
            const user = req.user;
            const { firstName, lastName, bio, avatarAction } = req.body;
            user.firstName = firstName;
            user.lastName = lastName;
            user.bio = bio;
            if (avatarAction === 'delete') {
                user.avatar = null;
            } else if (avatarAction === 'change') {
                user.avatar = req.file.filename;
            }
            user.save()
                .then(user => {
                    res.json(user);
                    io.emit(`user/${user._id}`, user);
                })
                .catch(next);
        });
    return app;
}