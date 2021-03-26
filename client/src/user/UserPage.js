import React from 'react';
import {
    Button, Container,
    makeStyles, Paper, Typography
} from '@material-ui/core';
import {
    Chat, Edit, PersonAdd,
    RemoveCircle
} from '@material-ui/icons';
import axios from 'axios';
import { useQuery } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { useFollowersCount, useIsFollowing } from '../follow/hooks';
import PageTemplate from '../page/PageTemplate';
import PostCard from '../post/PostCard';
import { useUser } from './hooks';
import LoadingButton from '../utils/LoadingButton';
import UserAvatar from './UserAvatar';
import Loader from '../utils/Loader';

const useStyles = makeStyles(theme => ({
    container: {
        padding: theme.spacing(2),
        '& > *': { marginBottom: theme.spacing(2) }
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(2)
    },
    avatar: {
        width: 100,
        height: 100
    },
    actions: {
        display: 'flex',
        '& > *': { margin: theme.spacing(1) }
    },
    posts: {
        '& > *': { marginBottom: theme.spacing(2) }
    }
}));
const FollowAction = ({ _id }) => {
    const { data: following, isLoading } = useIsFollowing(_id);
    const [loading, setLoading] = React.useState(false);
    if (isLoading) return null;
    if (!following) {
        const onClick = () => {
            setLoading(true);
            axios.post(`/follow/${_id}`)
                .then(() => {
                    setLoading(false);
                });
        };
        return <LoadingButton
            onClick={onClick}
            loading={loading}
            variant="contained"
            color='primary'
            startIcon={<PersonAdd />}>
            Follow
        </LoadingButton>
    } else {
        const onClick = () => {
            setLoading(true);
            axios.delete(`/follow/${_id}`)
                .then(() => setLoading(false));
        };
        return <LoadingButton
            onClick={onClick}
            loading={loading}
            variant="contained"
            size="small"
            startIcon={<RemoveCircle />}
        >
            Unfollow
        </LoadingButton>
    }
};
const FollowersCount = ({ user_id }) => {
    const { data: count, isLoading } = useFollowersCount(user_id);
    if (isLoading) return null;
    return <Button>{`${count} Followers`}</Button>
}

const Actions = ({ user_id }) => {
    const { data: me, isLoading } = useQuery('me',
        () => axios.get('/auth/me').then(res => res.data)
    );
    const styles = useStyles();
    if (isLoading) return <Loader />;

    return <div className={styles.actions}>{
        !isLoading
            ? me._id !== user_id
                ? <>
                    <FollowAction _id={user_id} />
                    <Button
                        component={Link}
                        to={`/message/${user_id}`}
                        variant="contained"
                        color="primary"
                        startIcon={<Chat />}
                    >
                        Message
                    </Button>
                </>
                : <Button
                    component={Link}
                    to={'/edit'}
                    variant="contained"
                    startIcon={<Edit />}
                >
                    Edit
                </Button>
            : <Loader />
    }</div>
}
const UserInfo = ({ _id }) => {
    const { data: user, isLoading } = useUser(_id);
    const styles = useStyles();
    if (isLoading) return <Loader />;
    return <Paper className={styles.info} elevation={10}>
        <UserAvatar _id={_id} className={styles.avatar} />
        <Typography variant="h6">
            {`${user.firstName} ${user.lastName}`}
        </Typography>
        <FollowersCount user_id={_id} />
        {user.bio && <Typography variant="body1">{user.bio}</Typography>}
        <Actions user_id={_id} />
    </Paper >;
};
export const UserPage = () => {
    const { _id } = useParams();
    const { data: posts } = useQuery(['post', { user_id: _id }], () =>
        axios.get(`/post/user/${_id}`).then(res => res.data)
    )
    const styles = useStyles();
    return <PageTemplate>
        <Container maxWidth="md" className={styles.container}>
            <UserInfo _id={_id} />
            <div className={styles.posts}>{
                posts
                    ? [...posts]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map(p =>
                            <PostCard _id={p._id} key={p._id} />
                        )
                    : <Loader />
            }</div>
        </Container>
    </PageTemplate>
}