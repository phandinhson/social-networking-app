import React from 'react';
import {
    IconButton,
    List,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItem,
    Popover,
    Badge,
    Typography,
    Container,
    makeStyles
} from '@material-ui/core';
import { Notifications as MUINotifications } from '@material-ui/icons';
import { usePostNotificationsCount, usePostNotifications } from './hooks';
import UserAvatar from '../user/UserAvatar';
import { Link } from 'react-router-dom';
import { useUser } from '../user/hooks';
import { usePost } from '../post/hooks'
import Loader from '../utils/Loader';
import ScrollDetector from '../utils/ScrollDetector';

const useStyles = makeStyles(theme => ({
    noWrap: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
}))
const LikeItem = ({ post_id, user_id }) => {
    const { data: user } = useUser(user_id);
    const styles = useStyles();
    return (
        <ListItem
            button
            component={Link}
            to={`/post/${post_id}`}
        >
            <ListItemAvatar>
                <UserAvatar _id={user_id} />
            </ListItemAvatar>
            <ListItemText
                primary={user
                    ? `${user.firstName} liked  your post.`
                    : "New like on your post."
                }
                className={styles.noWrap}
            />

        </ListItem>
    )
};
const CommentItem = ({ user_id, post_id, text }) => {
    const { data: user } = useUser(user_id);
    const styles = useStyles();
    return (
        <ListItem
            button
            component={Link}
            to={`/post/${post_id}`}
        >
            <ListItemAvatar>
                <UserAvatar _id={user_id} />
            </ListItemAvatar>
            <ListItemText
                primary={user
                    ? `${user.firstName} commented on your post.`
                    : 'New comment on your post.'
                }
                secondary={text}
                className={styles.noWrap}
            />
        </ListItem>
    )
};
const PostItemText = ({ _id }) => {
    const { data: user } = useUser(_id);
    return user ? `${user.firstName} add a new post.` : `Checkout this new post.`;
};

const UnseenPostItem = ({ post_id }) => {
    const { data: post, isLoading } = usePost(post_id);
    console.log(post_id, post);
    const styles = useStyles();
    return (
        <ListItem
            button
            component={Link}
            to={`/post/${post_id}`}
        >
            <ListItemAvatar>
                {!isLoading ? <UserAvatar _id={post.user_id} /> : <Avatar />}
            </ListItemAvatar>
            <ListItemText
                primary={post ? <PostItemText _id={post.user_id} /> : 'Checkout this new post.'}
                secondary={post?.text}
                className={styles.noWrap}
            />
        </ListItem>
    )
};
const ReplyItem = ({ user_id, post_id, text }) => {
    const { data: user } = useUser(user_id);
    const styles = useStyles();
    return (
        <ListItem
            button
            component={Link}
            to={`/post/${post_id}`}
        >
            <ListItemAvatar>
                <UserAvatar _id={user_id} />
            </ListItemAvatar>
            <ListItemText
                primary={user
                    ? `${user.firstName} replied your comment.`
                    : 'New reply on your comment.'
                }
                secondary={text}
                className={styles.noWrap}
            />
        </ListItem>
    )
}
const NotificationIcon = props => {
    const { data: count } = usePostNotificationsCount();
    const icon = <MUINotifications {...props} />;
    return count
        ? <Badge
            badgeContent={count}
            color="secondary"
        >
            {icon}
        </Badge>
        : icon;
};
function useClientRect() {
    const [rect, setRect] = React.useState(null);
    const ref = React.useCallback(node => {
        if (node !== null) {
            setRect(node.getBoundingClientRect());
        }
    }, []);
    return [rect, ref];
}
const NotificationsPopover = props => {
    let {
        data: notifications, isLoading, isFetching, fetchNextPage, hasNextPage
    } = usePostNotifications();
    let notificationList;
    if (isLoading) notificationList = null;
    else {
        notifications = [...notifications].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        notificationList = notifications.length > 0
            ? <List dense>
                {notifications.map(n =>
                    n.type === 'like'
                        ? <LikeItem {...n.like} key={n._id} />
                        : n.type === 'comment'
                            ? <CommentItem {...n.comment} key={n._id} />
                            : n.type === 'reply'
                                ? <ReplyItem {...n.comment} key={n._id} />
                                : <UnseenPostItem post_id={n.post_id} key={n._id} />
                )}
            </List>
            : <Typography variant="body1">No notifications.</Typography>

    }
    const [ref, rect] = useClientRect();
    return <Popover
        {...props}
        key={rect.width}
    >
        <Container maxWidth="xs" disableGutters ref={ref}>
            {notificationList}
            {!isFetching && hasNextPage
                && <ScrollDetector onScroll={fetchNextPage} />
            }
            {(isFetching || hasNextPage) && <Loader />}
        </Container>
    </Popover>
}
const Notifications = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const onClick = e => setAnchorEl(e.currentTarget);
    const onClose = () => setAnchorEl(null);
    return <div>
        <IconButton
            onClick={onClick}
            color="inherit"
        >
            <NotificationIcon />
        </IconButton>
        {Boolean(anchorEl) &&
            <NotificationsPopover
                open={true}
                anchorEl={anchorEl}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            />
        }

    </div>
}
export default Notifications;