const express = require('express'),
    Message = require('./models/message');

module.exports = (io) => {
    const app = express.Router();
    app
        .get('/user/:id', (req, res, next) => {
            const _id1 = req.user._id, _id2 = req.params.id;
            const { cursor } = req.query;
            let filter = {
                $or: [
                    { from_id: _id1, to_id: _id2 },
                    { from_id: _id2, to_id: _id1 }
                ],
                ...(cursor ? { _id: { $lt: cursor } } : {})
            };
            Message
                .find(filter)
                .sort({ _id: -1 })
                .limit(5)
                .then(res.json.bind(res))
                .catch(next)
        })
        .post('/:id', async (req, res) => {
            const from_id = req.user._id.toString(),
                to_id = req.params.id;
            const message = await Message.create({
                from_id,
                to_id,
                text: req.body.text
            });
            res.json(message);;
            io.to(from_id).emit(`message/user/${to_id}`, message);
            io.to(to_id).emit(`message/user/${from_id}`, message);

            io.to(to_id).emit('notification/message');
        });
    return app;
};
