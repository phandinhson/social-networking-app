import { makeStyles, Container, Typography } from "@material-ui/core"
import axios from "axios"
import { useInfiniteQuery, useQueryClient } from "react-query"
import PostCard from "./PostCard"
import PageTemplate from '../page/PageTemplate';
import flatten from '../utils/flatten';
import Loader from '../utils/Loader';
import ScrollDetector from '../utils/ScrollDetector';

const useStyles = makeStyles(theme => ({
    container: {
        '& > *': { marginTop: theme.spacing(2) },
    },
    posts: {
        '& > *': { marginTop: theme.spacing(2) }
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    },
    loader: {
        display: 'flex',
        justifyContent: 'center'
    }
}));

const Posts = () => {
    const queryClient = useQueryClient();
    const { data, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery('post',
        async ({ pageParam }) => {
            let url = '/post';
            if (pageParam) url += `?cursor=${pageParam}`;
            const res = await axios.get(url);
            res.data.forEach(p => {
                queryClient.setQueryData(['post', p._id], p);
            });
            return res.data;
        },
        { getNextPageParam: last => last[last.length - 1]?._id }
    );
    const styles = useStyles();
    return <div className={styles.posts}>
        {data?.pages &&
            flatten(data.pages)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map(p => <PostCard _id={p._id} key={p._id} />)
        }
        {!isFetching &&
            (hasNextPage
                ? <ScrollDetector onScroll={() => fetchNextPage()} />
                : <Typography variant="body1" align="center">No more posts.</Typography>
            )
        }
        {(isFetching || hasNextPage) && <Loader />}
    </div>
};

const FeedPage = () => {
    const styles = useStyles();
    return <PageTemplate>
        <Container maxWidth="md" className={styles.container}>
            <Posts />
        </Container>
    </PageTemplate>
};

export default FeedPage;