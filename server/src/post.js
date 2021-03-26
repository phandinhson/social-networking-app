const express = require('express'),
    Post = require('./models/post'),
    multer = require('multer'),
    Follow = require('./models/follow'),
    Notification = require('./models/notification');
const Comment = require('./models/comment');

const upload = multer({ dest: `${__dirname}/../images` });
module.exports = (io) => {
    const app = express.Router();
    app
        .get('/', (req, res, next) => {
            const { cursor } = req.query;
            Post
                .find(cursor ? { _id: { $lt: cursor } } : {})
                .sort({ _id: -1 })
                .limit(5)
                .then(res.json.bind(res))
                .catch(next)
        })
        .get('/search', async (req, res) => {
            res.json(await Post.find({ tags: req.query.tag }));
        })
        .get('/subscription', (req, res) => {
            Follow.aggregate([
                { $match: { follower_id: req.user._id } },
                { $lookup: { from: 'posts', localField: 'following_id', foreignField: 'user_id', as: 'post' } },
                { $unwind: '$post' },
                { $replaceWith: '$post' },
                { $sort: { createdAt: -1, _id: -1 } },
                ...(req.query.cursor
                    ? [{ $match: { _id: { $lt: req.query.cursor } } }]
                    : []
                ),
                { $limit: 5 }
            ]).then(res.json.bind(res));
        })
        .get('/user/:id', (req, res) => {
            Post.find({ user_id: req.params.id })
                .then(res.json.bind(res))
        })
        .get('/:id', (req, res, next) => {
            Post.findById(req.params.id)
                .then(res.json.bind(res))
                .catch(next);
        })
        .post('/', upload.array('files'), async (req, res, next) => {
            const postData = {
                user_id: req.user._id,
                text: req.body.text,
                tags: req.body.tags.split(' ')
            };
            if (req.files?.length > 0) {
                postData.files = req.files;
            }
            const post = await Post.create(postData);
            res.json(post);

            for await (const doc of Follow.find({ following_id: req.user._id })) {
                const notif = await Notification.create({
                    post_id: post._id,
                    user_id: doc.follower_id,
                    type: 'post'
                });
                io.to(doc.follower_id.toString()).emit('notification/post');
            }
        })
        .put('/:id', upload.array('newFiles'), async (req, res) => {
            const post = await Post.findById(req.params.id);
            if (!post.user_id.equals(req.user._id)) {
                return res.sendStatus(403);
            }
            post.text = req.body.text;
            post.tags = req.body.tags.split(' ');
            const oldFiles = JSON.parse(req.body.oldFiles);
            if (req.files?.length > 0) {
                post.files = [...oldFiles, ...req.files];
            } else {
                post.files = oldFiles;
            }
            const savedPost = await post.save();
            res.json(savedPost);
            io.emit(`post/${savedPost._id}`, savedPost);
        })
        .delete('/:id', async (req, res) => {
            const post = await Post.findById(req.params.id);
            if (!post.user_id.equals(req.user._id)) {
                res.sendStatus(403);
            }
            await Post.deleteOne({ _id: req.params.id });
            res.sendStatus(200);
            Notification.deleteMany({ post_id: req.params.id });
            const cmts = await Comment.find({ post_id: req.params.id });
            Comment.deleteMany({ post_id: req.params.id });
            Notification.deleteMany({ comment_id: { $in: cmts.map(c => c._id) } });
        })
    return app;
}