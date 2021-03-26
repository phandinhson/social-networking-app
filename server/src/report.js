const express = require('express');
const ReportedPost = require('./models/reported_post');
const app = express.Router();
app
    .get('/', async (req, res) => {
        const reports = await ReportedPost.aggregate([
            {$lookup: {from: 'users', localField: 'user_id', foreignField: '_id', as: 'reporter'}},
            {$unwind: '$reporter'},
            {$lookup: {from: 'posts', localField: 'post_id', foreignField: '_id', as: 'post'}},
            {$unwind: '$post'},
            {$lookup: {from: 'users', localField: 'post.user_id', foreignField: '_id', as: 'post_author'}},
            {$unwind: '$post_author'}
        ]);
        console.log(reports);
        res.json(reports);
    })
    .post('/post/:_id', (req, res) => {
        ReportedPost
            .create({
                user_id: req.user._id,
                post_id: req.params._id,
                reason: req.body.reason
            })
            .then(() => res.sendStatus(200));
    })
    .delete('/post/:_id', (req, res) => {
        ReportedPost.deleteMany({ post_id: req.params._id })
            .then(() => res.sendStatus(200));
    })
module.exports = app;