const Message = require('./models/message');
const express = require('express');
const mongoose = require('mongoose');
const Follow = require('./models/follow');
const Notification = require('./models/notification');
module.exports = io => {
    const app = express();
    app
        .get('/post', async (req, res) => {
            res.json(
                (await Notification.aggregate([
                    { $match: { user_id: req.user._id } },
                    ...(req.query.cursor
                        ? [{ $match: { _id: { $lt: mongoose.Types.ObjectId(req.query.cursor) } } }]
                        : []
                    ),
                    { $lookup: { from: 'likes', localField: 'like_id', foreignField: '_id', as: 'like' } },
                    { $lookup: { from: 'comments', localField: 'comment_id', foreignField: '_id', as: 'comment' } },
                    { $lookup: { from: 'posts', localField: 'post_id', foreignField: '_id', as: 'post' } },
                    { $sort: { createdAt: -1, _id: -1 } },
                    { $limit: 5 }
                ]))
                    .map(n => ({
                        ...n,
                        like: n.type === 'like' ? n.like[0] : undefined,
                        comment: n.type === 'comment' || n.type === 'reply' ? n.comment[0] : undefined,
                        post: n.type === 'post' ? n.post[0] : undefined
                    }))
            );
        })
        .get('/post/count', async (req, res) => {
            res.json(await Notification.countDocuments({
                user_id: req.user._id,
                type: { $in: ['like', 'comment', 'reply', 'post'] },
                seen: null
            }));
        })
        .delete('/post', async (req, res) => {
            await Notification.updateMany({ _id: { $in: req.body } }, { seen: Date.now() });
            res.sendStatus(200);
            io.to(req.user._id.toString()).emit('notification/post');
        })
        .get('/message', (req, res) => {
            Message.aggregate([
                { $match: { to_id: req.user._id } },
                { $sort: { createdAt: -1 } },
                {
                    $group: {
                        _id: '$from_id',
                        preview: { $first: '$text' },
                        createdAt: { $first: '$createdAt' }
                    }
                },
            ]).then(res.json.bind(res));
        })
        .get('/message/count', (req, res) => {
            Message.aggregate([
                { $match: { to_id: req.user._id, seen: null } },
                { $group: { _id: '$from_id' } },
                { $group: { _id: null, count: { $sum: 1 } } }
            ]).then(result => {
                res.json(result.length ? result[0].count : 0);
            });
        })
        .delete('/message', async (req, res) => {
            await Message.updateMany(
                { seen: null, to_id: req.user._id },
                { seen: Date.now() }
            );
            res.sendStatus(200);
            io.to(req.user._id.toString()).emit('notification/message');
        })
        .delete('/message/:user_id', async (req, res) => {
            await Message.updateMany(
                { seen: null, to_id: req.user._id, from_id: req.params.user_id },
                { seen: Date.now() }
            );
            res.sendStatus(200);
            io.to(req.user._id.toString()).emit('notification/message');
        })
        .get('/follow', (req, res) => {
            Follow.find({ following_id: req.user._id })
                .then(res.json.bind(res));
        })
        .get('/follow/count', (req, res) => {
            Follow.countDocuments({ following_id: req.user._id, seen: null })
                .then(res.json.bind(res));
        })
        .delete('/follow', async (req, res) => {
            await Follow.updateMany(
                { following_id: req.user._id, seen: null },
                { seen: Date.now() }
            );
            res.sendStatus(200);
            io.to(req.user._id.toString()).emit('notification/follow');
        });
    return app;
};