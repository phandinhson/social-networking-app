import {
    List,
    ListItem,
    ListItemAvatar, ListItemText,
    Typography,
    Container, makeStyles,
    CircularProgress, Button} from '@material-ui/core';
import axios from 'axios';
import React from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import PageTemplate from '../page/PageTemplate';
import UserAvatar from "../user/UserAvatar";
import UserLink from "../user/UserLink";
import { useLikes } from '../like/hooks';
import LoadingButton from '../utils/LoadingButton';
import PostCard from './PostCard';
import Tabs from '../utils/Tabs';
import ConfirmDialog from '../utils/ConfirmDialog';
import { Delete, Edit } from '@material-ui/icons';
import { useUserMe } from '../user/hooks';
import { usePost } from './hooks';
import CommentPost from '../comment/CommentSection';
/*
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

const AddComment = ({ post_id }) => {
    const [text, setText] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const styles = useAddCommentStyles();
    const onSubmit = e => {
        e.preventDefault();
        setLoading(true);
        axios.post(`/comment/${post_id}`, { text })
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

const useCommentStyles = makeStyles(() => ({
    text: { whiteSpace: 'pre-line' }
}));
const CommentList = ({ post_id }) => {
    const { data: comments } = useComments(post_id);
    const styles = useCommentStyles();
    if (!comments) return <Loader />;
    return <List>{
        comments.map(c =>
            <ListItem alignItems="flex-start" key={c._id}>
                <ListItemAvatar>
                    <UserAvatar _id={c.user_id} />
                </ListItemAvatar>
                <ListItemText
                    primary={<UserLink _id={c.user_id} />}
                    secondary={
                        <Typography variant="body2" className={styles.text}>
                            {c.text}
                        </Typography>
                    }
                    disableTypography
                />
                <ListItemSecondaryAction>
                    <CommentActions comment={c} />
                </ListItemSecondaryAction>
            </ListItem>
        )
    }</List>
};
*/
const LikeList = ({ post_id }) => {
    const { data: likes, isLoading } = useLikes(post_id);
    if (isLoading) return <CircularProgress />;
    return <List>{
        likes.map(l =>
            <ListItem alignItems="flex-start" key={l._id}>
                <ListItemAvatar>
                    <UserAvatar _id={l.user_id} />
                </ListItemAvatar>
                <ListItemText
                    primary={<UserLink _id={l.user_id} />}
                />
            </ListItem>
        )
    }</List>;
};

const DeleteButton = ({ post_id }) => {
    const [isOpen, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const history = useHistory();
    const open = () => setOpen(true);
    const close = () => setOpen(false);
    const submit = () => {
        axios.delete(`/post/${post_id}`)
            .then(() => {
                setLoading(false);
                history.goBack();
            });
        setLoading(true);
    }
    return <div>
        <LoadingButton
            startIcon={<Delete />}
            onClick={open}
            loading={loading}
        >
            Delete
        </LoadingButton>
        <ConfirmDialog
            open={isOpen}
            onClose={close}
            onSubmit={submit}
            title="Confirm"
            content="Are you sure you want to delete this post?"
        />
    </div>
};
const useActionStyles = makeStyles({
    actions: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
})
const Actions = ({ post_id }) => {
    const { data: me, isLoading: isMeLoading } = useUserMe();
    const { data: post, isLoading: isPostLoading } = usePost(post_id);
    const styles = useActionStyles();
    if (isMeLoading || isPostLoading) return null;
    if (me._id === post.user_id) {
        return <div className={styles.actions}>
            <Button
                component={Link}
                to={`/post/${post._id}/edit`}
                startIcon={<Edit />}
            >
                Edit
                </Button>
            <DeleteButton post_id={post._id} />
        </div>
    }
    return null;
}
const usePageStyles = makeStyles(theme => ({
    container: {
        '& > *': {
            marginTop: theme.spacing(2)
        }
    }
}));

const PostPage = () => {
    const { _id } = useParams();
    const { data: post, isLoading } = usePost(_id);
    const styles = usePageStyles();
    return <PageTemplate>
        <Container maxWidth="md" className={styles.container}>{
            (!isLoading && post === null)
                ? <>
                    <Typography variant="h3">Post not found!</Typography>
                    <Button component={Link} to="/">Home</Button>
                </>
                : <>

                    <PostCard _id={_id} />
                    <Actions post_id={_id} />
                    <Tabs
                        indicatorColor="primary"
                        textColor="primary"
                    >{[
                        [
                            { label: 'Comments' },
                            <CommentPost post_id={_id} />
                        ],
                        [
                            { label: 'Likes' },
                            <LikeList post_id={_id} />
                        ]
                    ]}</Tabs>
                </>
        }</Container>
    </PageTemplate >
}

export default PostPage;