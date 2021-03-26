const express = require('express'),
    Like = require('./models/like'),
    Post = require('./models/post'),
    Notification = require('./models/notification');
module.exports = (io) => {
    const app = express.Router();
    app
        .get('/:post_id', (req, res) => {
            Like.find({ post_id: req.params.post_id })
                .then(res.json.bind(res));
        })
        .get('/count/:id', (req, res) => {
            Like.countDocuments({ post_id: req.params.id })
                .then(res.json.bind(res));
        })
        .get('/isliked/:id', (req, res) => {
            Like.findOne({ post_id: req.params.id, user_id: req.user._id })
                .then(like => res.json(like !== null));
        })
        .post('/:id', async (req, res) => {
            const post_id = req.params.id;
            const like = await Like.create({ post_id, user_id: req.user._id });
            res.json(like);
            io.emit(`like/${post_id}`);

            const post = await Post.findById(post_id);
            if (post.user_id.equals(req.user._id)) return;
            await Notification.create({ user_id: post.user_id, type: 'like', like_id: like._id });
            io.to(post.user_id.toString()).emit('notification/post');
        })
        .delete('/:id', async (req, res) => {
            const post_id = req.params.id;
            const like = await Like.findOneAndDelete({ post_id, user_id: req.user._id });
            res.sendStatus(200);
            io.emit(`like/${post_id}`);

            const post = await Post.findById(post_id);
            if (post.user_id.equals(req.user._id)) return;
            await Notification.deleteOne({ like_id: like._id });
            io.to(post.user_id.toString()).emit('notification/post');
        });
    return app;
};
