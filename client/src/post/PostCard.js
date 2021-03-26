import {
    Card, CardActions, CardContent, CardHeader,
    IconButton, Typography, makeStyles, CardMedia, Chip, Button
} from '@material-ui/core';
import { ChevronLeft, ChevronRight, Comment, Done, Favorite, Launch } from '@material-ui/icons';
import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import UserAvatar from "../user/UserAvatar";
import UserLink from "../user/UserLink";
import { useIsLiked, useLikesCount } from '../like/hooks';
import { usePost } from './hooks';
import { useCommentsCount } from '../comment/hooks';
const LikesCount = ({ post_id }) => {
    const { data: count, isLoading } = useLikesCount(post_id);
    return !isLoading
        ? <Typography variant="button">{count}</Typography>
        : null;
}
const LikeButton = ({ post_id }) => {
    const { data, isLoading } = useIsLiked(post_id);
    const [clicked, setClicked] = React.useState(false);
    const onClick = () => {
        setClicked(true);
        if (!data) {
            axios.post(`/like/${post_id}`)
                .then(() => setClicked(false));
            //.then(() => queryClient.invalidateQueries(['like', _id]));
        } else {
            axios.delete(`/like/${post_id}`)
                .then(() => setClicked(false));
            //.then(() => queryClient.invalidateQueries(['like', _id]));
        }
    }
    return <IconButton onClick={onClick}
        {...(data ? { color: 'primary' } : {})}
        disabled={clicked || isLoading}>
        <Favorite />
    </IconButton>

}
const CommentsCount = ({ post_id }) => {
    const { data: count, isLoading } = useCommentsCount(post_id);
    return !isLoading
        ? <Typography variant="button">{count}</Typography>
        : null;
}
const useStyles = makeStyles(() => ({
    mediaContainer: { position: 'relative' },
    media: {
        height: 0,
        paddingTop: '56.25%',
    },
    controls: {
        display: 'flex',
        justifyContent: 'center',
    },
    content: { whiteSpace: 'pre-line' },
    hidden: {
        display: 'none'
    }
}));
const Media = ({ files }) => {
    const [current, setCurrent] = React.useState(0);
    const styles = useStyles();
    React.useEffect(() => {
        setCurrent(0);
    }, [files]);
    const { mimetype, filename } = files[current];
    return <div className={styles.mediaContainer}>
        {mimetype.includes('video') ?
            <CardMedia
                component="video"
                src={`/${filename}`}
                controls
            /> :
            <CardMedia
                image={`/${filename}`}
                className={styles.media}
            />
        }
        {files.length > 1 &&
            <div className={styles.controls}>
                <IconButton
                    onClick={() => setCurrent((current - 1 + files.length) % files.length)}
                    className={styles.btnPrevious}
                    disabled={current === 0}
                >
                    <ChevronLeft />
                </IconButton>
                <IconButton
                    onClick={() => setCurrent((current + 1) % files.length)}
                    className={styles.btnNext}
                    disabled={current >= files.length - 1}
                >
                    <ChevronRight />
                </IconButton>
            </div>
        }
    </div>
};
const ReportButton = ({ post_id }) => {
    const [state, setState] = React.useState(false);
    const onClick = () => {
        axios.post(`/report/post/${post_id}`)
            .then(() => setState(true));
    }
    return state
        ? <Button endIcon={<Done />} disabled>Reported</Button>
        : <Button onClick={onClick}>Report</Button>
}
const PostCard = ({ _id }) => {
    const { data: post, isLoading } = usePost(_id);
    const styles = useStyles();
    if (isLoading) return null;
    if (post === null) return null;
    return <Card elevation={10}>
        <CardHeader
            title={<UserLink _id={post.user_id} />}
            avatar={<UserAvatar _id={post.user_id} />}
            subheader={new Date(post.createdAt).toLocaleDateString()}
            action={
                window.location.pathname !== `/post/${_id}` &&
                <IconButton component={Link} to={`/post/${_id}`}>
                    <Launch />
                </IconButton>
            }
        />
        {post.text &&
            <CardContent className={styles.content}>
                <Typography variant="body1">
                    {post.text}
                </Typography>
            </CardContent>
        }
        {post.tags &&
            <CardContent>
                {post.tags.map(tag => <Chip label={tag} key={tag} />)}
            </CardContent>
        }
        {post.files && post.files.length > 0 &&
            <Media files={post.files} />
        }
        <CardActions>
            <div>
                <LikeButton post_id={_id} />
                <LikesCount post_id={_id} />
            </div>
            <div>
                <IconButton
                    component={Link}
                    to={`/post/${_id}`}>
                    <Comment />
                </IconButton>
                <CommentsCount post_id={_id} />
            </div>
            <div style={{ marginLeft: 'auto' }}>
                <ReportButton post_id={_id}>Report</ReportButton>
            </div>
        </CardActions>
    </Card>
};

export default PostCard;