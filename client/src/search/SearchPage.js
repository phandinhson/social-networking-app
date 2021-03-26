import React from 'react';
import {
    Container,
    makeStyles,
    TextField,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import UserAvatar from '../user/UserAvatar';
import UserLink from '../user/UserLink';
import PageTemplate from '../page/PageTemplate';
import LoadingButton from '../utils/LoadingButton';
import axios from 'axios';
import PostCard from '../post/PostCard';

const useStyles = makeStyles(theme => ({
    container: {
        '& > *': { marginTop: theme.spacing(2) }
    },
    searchbar: {
        display: 'flex',
        '& > *': { margin: theme.spacing(1) }
    },
    posts: {
        '& > *': { marginTop: theme.spacing(2) }
    }
}));
const SearchPage = () => {
    const [text, setText] = React.useState('');
    const [result, setResult] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [filter, setFilter] = React.useState('user');
    const styles = useStyles();
    const onSubmit = e => {
        e.preventDefault();

        if (filter === 'user') {
            axios.get('/user', { params: { q: text } })
                .then(res => {
                    setResult({ filter: 'user', data: res.data });
                    setLoading(false);
                });
        } else {
            axios.get('/post/search', { params: { tag: text } })
                .then(res => {
                    setResult({ filter: 'post', data: res.data });
                    setLoading(false);
                });
        }
        setLoading(true);
    }
    return <PageTemplate>
        <Container maxWidth="sm" className={styles.container}>
            <form onSubmit={onSubmit}>
                <div className={styles.searchbar}>
                    <TextField
                        placeholder="John Doe"
                        onChange={e => setText(e.target.value)}
                        fullWidth
                        required
                    />
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        loading={loading}
                        startIcon={<Search />}
                    >
                        Search
                </LoadingButton>
                </div>
                <TextField
                    select
                    label="Filter"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                >
                    <MenuItem value={'user'}>User</MenuItem>
                    <MenuItem value={'post'}>Tag</MenuItem>
                </TextField>

            </form>
            {result && (
                result.filter === 'user'
                    ? <List>{
                        result.data?.map(user =>
                            <ListItem key={user._id}>
                                <ListItemAvatar>
                                    <UserAvatar _id={user._id} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<UserLink _id={user._id} />}
                                />
                            </ListItem>)
                    }</List>
                    : <div className={styles.posts}>
                        {result.data?.map(post => <PostCard _id={post._id} key={post._id} />)}
                    </div>
            )
            }

        </Container>
    </PageTemplate>
}

export default SearchPage;