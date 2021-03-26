import React from 'react';
import {
    IconButton,
    Typography,
    makeStyles,
    Paper,
    TextField,
    Button
} from '@material-ui/core';
import axios from 'axios';
import Loader from '../utils/Loader';
import UserAvatar from '../user/UserAvatar';
import UserLink from '../user/UserLink';
import { ArrowBack, Reply } from '@material-ui/icons';
import LoadingButton from '../utils/LoadingButton';
import { useReplies, useRepliesCount, usePostComments } from './hooks';
import CommentActions from './Actions';
const useAddCommentStyles = makeStyles(theme => ({
    paper: {
        position: 'sticky',
        bottom: 0,
        zIndex: 1
    },
    form: {
        display: 'flex',
        alignItems: 'flex-end',
        '& > *': { margin: theme.spacing(1) },
        zIndex: 2
    },
    content: { flexGrow: 1 }
}));
const AddComment = ({ type, post_id, comment_id }) => {
    const [text, setText] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const styles = useAddCommentStyles();
    const onSubmit = e => {
        e.preventDefault();
        setLoading(true);
        axios
            .post(
                type === 'post'
                    ? `/comment/post/${post_id}`
                    : `/comment/reply/${comment_id}`,
                { text }
            )
            .then(() => {
                setText('');
                setLoading(false);
            });
    }
    return <Paper className={styles.paper}>
        <form
            onSubmit={onSubmit}
            className={styles.form}
        >
            <TextField
                label="Comment"
                value={text}
                onChange={e => setText(e.target.value)}
                multiline
                rowsMax={4}
                className={styles.content} />
            <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                loading={loading}
            >
                Add
            </LoadingButton>
        </form>
    </Paper>
};
const useCommentStyles = makeStyles(theme => ({
    root: { display: 'flex', '& > *': { margin: theme.spacing(1) } },
    content: { flexGrow: 1 }
}))
const Comment = ({ comment, onReply = () => { } }) => {
    const { data: count } = useRepliesCount(comment);
    const styles = useCommentStyles();
    const { user_id, text } = comment;
    return <div className={styles.root}>
        <UserAvatar _id={user_id} />
        <div className={styles.content}>
            <UserLink _id={user_id} />
            <Typography variant="body2">{text}</Typography>
            <Button onClick={() => onReply(comment)}
                startIcon={<Reply />}>
                {count ? <span>{count} Replies</span> : 'Reply'}
            </Button>
        </div>
        <CommentActions comment={comment} />
    </div>
}

const CommentReplies = ({ root, onReply, onBack }) => {
    const { data: comments, isLoading } = useReplies(root);
    if (isLoading) return <Loader />
    return <div>
        <IconButton onClick={onBack}>
            <ArrowBack />
        </IconButton>
        <Comment comment={root} />
        <div style={{ marginLeft: '50px' }}>
            {comments.map(c => <Comment comment={c} key={c._id} onReply={onReply} />)}
        </div>
        <AddComment type={'reply'} comment_id={root._id} />
    </div>
}
const CommentPost = ({ post_id }) => {
    const { data: comments, isLoading } = usePostComments(post_id);
    const [stack, setStack] = React.useState([{ type: 'post', post_id }]);
    const onReply = comment => setStack(stack => [...stack, { type: 'comment', comment }]);
    const onBack = () => setStack(stack => stack.slice(0, -1));
    if (isLoading) return <Loader />;
    const last = stack[stack.length - 1];
    if (last.type === 'post') {
        return <div>
            {comments.map(c =>
                <Comment comment={c} onReply={onReply} key={c._id} />
            )}
            <AddComment type={'post'} post_id={post_id} />
        </div>
    }
    console.log(last)
    return <CommentReplies root={last.comment} onReply={onReply} onBack={onBack} />
}

export default CommentPost;