const express = require('express'),
    Comment = require('./models/comment'),
    Post = require('./models/post'),
    Notification = require('./models/notification');

const app = express.Router();
module.exports = io => {
    app
        .get('/post/:post_id', (req, res) => {
            Comment.find({ post_id: req.params.post_id, reply_to_id: null })
                .then(res.json.bind(res));
        })
        .get('/reply/:comment_id', async (req, res) => {
            res.json(
                await Comment.find({ reply_to_id: req.params.comment_id })
            );
        })
        .get('/reply/count/:comment_id', async (req, res) => {
            res.json(
                await Comment.countDocuments({ reply_to_id: req.params.comment_id })
            );
        })
        .post('/post/:post_id', async (req, res, next) => {
            const comment = await Comment.create({
                post_id: req.params.post_id,
                user_id: req.user,
                text: req.body.text
            });
            res.json(comment);
            io.emit(`comment/post/${comment.post_id}`);

            const post = await Post.findById(comment.post_id);
            if (post.user_id.equals(req.user._id)) return;
            await Notification.create({
                user_id: post.user_id,
                type: 'comment',
                comment_id: comment._id
            });
            io.to(post.user_id.toString()).emit('notification/post');
        })
        .post('/reply/:comment_id', async (req, res) => {
            const reply_to_id = req.params.comment_id;
            const comment = await Comment.create({
                post_id: (await Comment.findById(reply_to_id)).post_id,
                reply_to_id,
                user_id: req.user._id,
                text: req.body.text
            });
            res.json(comment);
            io.emit(`comment/post/${comment.post_id}`);
            const reply_to = await Comment.findById(reply_to_id);
            if (reply_to.user_id.equals(req.user._id)) return;
            await Notification.create({
                user_id: reply_to.user_id,
                type: 'reply',
                comment_id: comment._id
            });
            io.to(reply_to.user_id.toString()).emit('notification/post');
        })
        .get('/post/count/:post_id', (req, res) => {
            Comment.countDocuments({ post_id: req.params.post_id })
                .then(res.json.bind(res));
        })
        .get('/:id', (req, res) => {
            Comment.findById(req.params.id)
                .then(res.json.bind(res));
        })
        .put('/:id', (req, res) => {
            Comment.findByIdAndUpdate(req.params.id, { text: req.body.text })
                .then(comment => {
                    res.sendStatus(200);
                    io.emit(`comment/post/${comment.post_id}`);
                })
        })
        .delete('/:id', async (req, res) => {
            Comment.findByIdAndDelete(req.params.id)
                .then(comment => {
                    res.sendStatus(200);
                    io.emit(`comment/post/${comment.post_id}`);
                });
            await Comment.deleteMany({ reply_to_id: req.params.id });
            await Notification.deleteMany({ comment_id: req.params._id });
        });
    return app;
};