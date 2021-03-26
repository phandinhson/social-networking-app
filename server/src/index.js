const express = require('express'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    passport = require('passport'),
    { User } = require('./models/user');

mongoose.connect(
    //process.env.MONGODB_URL,
    'mongodb://localhost:27017/test',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const mdwSession = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
});

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app
    .use(morgan('dev'))
    .use(express.json())
    .use(mdwSession)
    .use(passport.initialize())
    .use(passport.session())
    .use('/auth', require('./auth'))
    .use('/post', require('./post')(io))
    .use('/user', require('./user')(io))
    .use('/like', require('./like')(io))
    .use('/comment', require('./comment')(io))
    .use('/follow', require('./follow')(io))
    .use('/message', require('./message')(io))
    .use('/notification', require('./notification')(io))
    .use('/report', require('./report'))
    .use(express.static(`${__dirname}/../images`))
    .use(express.static(`${__dirname}/../../client/build`))
    .use((req, res) => res.sendFile(`${__dirname}/../../client/build/index.html`));

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io
    .use(wrap(morgan('dev')))
    .use(wrap(mdwSession))
    .use(wrap(passport.initialize()))
    .use(wrap(passport.session()))
    .on('connection', socket => {
        if (socket.request.user) {
            const id = socket.request.user._id.toString();
            const notifyUserChanged = updatedUser => io.emit(`user/${id}`, updatedUser);
            socket.join(id);
            User.findByIdAndUpdate(id, { lastActive: null })
                .then(notifyUserChanged);

            socket.on('disconnect', () => {
                if (!(io.sockets.adapter.rooms.get(id)?.size)) {
                    User.findByIdAndUpdate(id, { lastActive: Date.now() })
                        .then(notifyUserChanged);
                }
            });
        }
    });
server.listen(process.env.PORT || 5000);