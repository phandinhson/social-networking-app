import React from 'react';
import {
    Card, CardActions, Container,
    CardContent, Button, makeStyles, CardMedia, Typography, CircularProgress
} from '@material-ui/core';
import axios from 'axios';
import { useQuery } from 'react-query';
import PageTemplate from '../page/PageTemplate';
const ReportItem = ({ reporter, post, post_author }) => {
    console.log(post);
    return <Card>
        <CardContent>
            <Typography variant="h6">
                {`${reporter.firstName} ${reporter.lastName} reported ${post_author.firstName} ${post_author.lastName}'s post`}
            </Typography>
        </CardContent>
        <Container maxWidth="sm">
            {post.files.length > 0
                ? post.files[0].mimetype.includes('video')
                    ? <CardMedia component="video" src={`/${post.files[0].filename}`} controls />
                    : <CardMedia image={`/${post.files[0].filename}`} style={{ height: 140, paddingTop: '56.25%' }} />
                : <CardContent>
                    <Typography variant="body2">{post.text.slice(0, 100)}</Typography>
                </CardContent>
            }
        </Container>
        <CardActions>
            <Button color="secondary">Delete Post</Button>
        </CardActions>
    </Card>
}
const useStyles = makeStyles(theme => ({
    container: {
        '& > *': {
            marginTop: theme.spacing(2)
        }
    }
}));
const ReportedPostsPage = () => {
    const { data } = useQuery('reported',
        () => axios.get('/report').then(res => res.data)
    );
    const styles = useStyles();

    return <PageTemplate>
        <Container maxWidth="md" className={styles.container}>
            {data
                ? data.map(report => <ReportItem key={report._id} {...report} />)
                : <CircularProgress />
            }
        </Container>
    </PageTemplate>
}

export default ReportedPostsPage;