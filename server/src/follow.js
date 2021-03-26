const express = require('express'),
    Follow = require('./models/follow');

module.exports = io => {
    const app = express.Router();
    app
        .get('/', async (req, res) => {
            res.json(
                await Follow.find({ follower_id: req.user._id })
            )
        })
        .get('/isFollowing/:user_id', (req, res) => {
            Follow
                .findOne({
                    follower_id: req.user._id,
                    following_id: req.params.user_id
                })
                .then(follow => res.json(follow !== null))
        })
        .get('/count/:user_id', (req, res) => {
            Follow.countDocuments({ following_id: req.params.user_id })
                .then(res.json.bind(res));
        })
        .post('/:user_id', async (req, res) => {
            const follower_id = req.user._id,
                following_id = req.params.user_id;
            const follow = await Follow.create({ follower_id, following_id });
            res.json(follow);
            io.emit(`follower/${req.params.user_id}`);
            io.emit(`following/${req.user._id}`);

            io.to(following_id.toString()).emit('notification/follow');
        })
        .delete('/:user_id', async (req, res) => {
            const follower_id = req.user._id,
                following_id = req.params.user_id;
            const follow = await Follow.findOneAndDelete({ follower_id, following_id });
            res.json(follow);
            io.emit(`follower/${req.params.user_id}`);
            io.emit(`following/${req.user._id}`);
            io.to(following_id).emit('notification/follow');
        })
    return app;
};