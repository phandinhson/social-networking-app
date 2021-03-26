import React from 'react';
import { Container, Grid, Card, CardContent, makeStyles } from '@material-ui/core';
import { useQuery } from 'react-query';
import axios from 'axios';
import Loader from '../utils/Loader';
import UserAvatar from '../user/UserAvatar';
import UserLink from '../user/UserLink';
import PageTemplate from '../page/PageTemplate';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        width: 100,
        height: 100
    }
}));
const ContactPage = () => {
    const { data: following, isLoading } = useQuery('follow', () =>
        axios.get('/follow').then(res => res.data)
    );
    const styles = useStyles();
    if (isLoading) return <Loader />
    return <PageTemplate>
        <Container maxWidth="md">
            <Grid container spacing={2}>
                {following.map(f =>
                    <Grid item xs={12} md={4} key={f._id}>
                        <Card>
                            <CardContent className={styles.root}>
                                <UserAvatar _id={f.following_id} className={styles.avatar} />
                                <UserLink _id={f.following_id} />
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Container>
    </PageTemplate>
}

export default ContactPage;