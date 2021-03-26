import {
    makeStyles,
    TextField,
    Typography,
    Container,
    Popover,
    IconButton
} from '@material-ui/core';
import { EmojiEmotions } from '@material-ui/icons'
import axios from 'axios';
import React from 'react';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import PageTemplate from '../page/PageTemplate';
import UserAvatar from '../user/UserAvatar';
import UserLink from '../user/UserLink';
import LoadingButton from '../utils/LoadingButton';
import { useWebSocketListener } from '../websocket/hooks';
import ScrollDetector from '../utils/ScrollDetector';
import flatten from '../utils/flatten';
import Loader from '../utils/Loader';
import EmojiPicker from 'emoji-picker-react';

const useStyles = makeStyles(theme => ({
    container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
    },
    main: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
    },
    padAppBar: theme.mixins.toolbar,
    header: {
        display: 'flex',
        alignItems: 'center',
        '& > *': { margin: theme.spacing(1) },
        boxShadow: theme.shadows[3],
        zIndex: 1
    },
    form: {
        display: 'flex',
        alignItems: 'center',
        '& > *': { margin: theme.spacing(1) },
        boxShadow: theme.shadows[3],
        zIndex: 1
    },
    messages: {
        flexGrow: 1,
        overflow: 'auto',
        padding: theme.spacing(0.5),
    },
    incomingLine: {
        display: 'flex',
        alignItems: 'flex-end',
        '& > *': { margin: theme.spacing(0.5) }
    },
    outgoingLine: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'flex-end',
        '& > *': { margin: theme.spacing(0.5) }
    },
    incomingMessage: {
        borderRadius: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary.main,
        padding: theme.spacing(1),

    },
    outgoingMessage: {
        borderRadius: theme.spacing(2),
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.background.paper,
        padding: theme.spacing(1),
    },
    avatarPlaceHolder: {
        width: 40,
        height: 40,
        flexShrink: 0
    }
}));
const Incoming = ({ message }) => {
    const styles = useStyles();
    return <div className={styles.incomingLine}>
        <UserAvatar _id={message.from_id} />
        <div className={styles.incomingMessage}>
            <Typography variant="body1">
                {message.text}
            </Typography>
        </div>
        <div className={styles.avatarPlaceHolder} />
    </div>
}
const Outgoing = ({ message }) => {
    const styles = useStyles();
    return <div className={styles.outgoingLine}>
        <UserAvatar _id={message.from_id} />
        <div className={styles.outgoingMessage}>
            <Typography variant="body1">
                {message.text}
            </Typography>
        </div>
        <div className={styles.avatarPlaceHolder} />
    </div>
}

const useMessageListener = (_id, onMessage) => {
    const queryClient = useQueryClient();
    useWebSocketListener(`message/user/${_id}`, message => {
        queryClient.setQueryData(['message', _id], data => {
            if (data.pages) {
                const [first, ...rest] = data.pages;
                const newPages = [[message, ...first], ...rest];
                return { ...data, pages: newPages };
            }
            return data;
        });
        onMessage();
    });
};
const useMessageInfiniteQuery = (_id) => {
    return useInfiniteQuery(['message', _id],
        async ({ pageParam }) => {
            let url = `/message/user/${_id}`;
            if (pageParam) url += `?cursor=${pageParam}`;
            return axios.get(url).then(res => res.data);
        },
        { getNextPageParam: last => last[last.length - 1]?._id }
    );
}
const useSeenMessageEffect = (messages, from_id) => {
    const [deleting, setDeleting] = React.useState(false);
    React.useEffect(() => {
        const unseen = messages?.filter(m => m.from_id === from_id && !m.seen);
        if (unseen?.length > 0 && !deleting) {
            setDeleting(true);
            axios.delete(`/notification/message/${from_id}`)
                .then(() => setDeleting(false));
        }
    }, [messages, deleting, from_id]);
}
const Messages = ({ _id }) => {
    const {
        data, isFetching, fetchNextPage, hasNextPage
    } = useMessageInfiniteQuery(_id);
    const bottomRef = React.useRef(null);
    const [scrollBottom, setScrollBottom] = React.useState(false);
    React.useEffect(() => {
        if (scrollBottom) {
            bottomRef.current.scrollIntoView({ behaviour: 'smooth' });
            setScrollBottom(false);
        }
    }, [scrollBottom]);
    useMessageListener(_id, () => setScrollBottom(true));

    const [last_id, setLast_id] = React.useState();
    const lastRef = React.useRef(null);
    const messages = data &&
        flatten(data.pages)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    useSeenMessageEffect(messages, _id);

    const [loadOld, setLoadOld] = React.useState(false);
    React.useEffect(() => {
        if (loadOld) {
            lastRef.current.scrollIntoView();
            setLoadOld(false);
        }
    }, [loadOld]);
    const onScrollTop = () => {
        if (isFetching) return;
        setLast_id(messages[0]._id);
        fetchNextPage().then(() => setLoadOld(true));
    }
    const styles = useStyles();
    return <div className={styles.messages}>
        {hasNextPage && <ScrollDetector onScroll={onScrollTop} />}
        {(isFetching || hasNextPage) && <Loader />}
        {messages?.map(m =>
            <React.Fragment key={m._id}>
                {m._id === last_id && <div ref={lastRef} />}
                {m.from_id === _id
                    ? <Incoming message={m} key={m._id} />
                    : <Outgoing message={m} key={m._id} />
                }
            </React.Fragment>
        )}
        <div ref={bottomRef} />
    </div>
}
const Emoji = ({ onEmoji }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const onClick = e => setAnchorEl(e.currentTarget);
    const onClose = () => setAnchorEl(null);
    return <div>
        <IconButton
            onClick={onClick}
        >
            <EmojiEmotions />
        </IconButton>
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
        >
            {<EmojiPicker
                onEmojiClick={(_, emoji) => { onEmoji(emoji.emoji); onClose() }}
                native
                preload
            />}
        </Popover>
    </div>
}
const Input = ({ _id }) => {
    const [text, setText] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const styles = useStyles();
    const onSubmit = e => {
        e.preventDefault();
        setLoading(true);
        axios.post(`/message/${_id}`, { text })
            .then(() => {
                setText('');
                setLoading(false);
            });
    }
    return <form className={styles.form} onSubmit={onSubmit}>
        <TextField value={text} onChange={e => setText(e.target.value)}
            fullWidth required />
        <Emoji onEmoji={e => setText(t => t + e)} />
        <LoadingButton
            type="submit"
            color="primary"
            variant="contained"
            loading={loading}
        >
            Send
        </LoadingButton>
    </form>
}
export const Inbox = () => {
    const { _id } = useParams();
    const styles = useStyles();
    return <PageTemplate disablePaddingTop>
        <Container maxWidth="lg" className={styles.container} disableGutters>
            <div className={styles.padAppBar} />
            <div className={styles.header}>
                <UserAvatar _id={_id} />
                <UserLink _id={_id} />
            </div>
            <div className={styles.main}>
                <Messages _id={_id} />
                <Input _id={_id} />
            </div>
        </Container>
    </PageTemplate>
}