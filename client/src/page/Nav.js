import React from 'react';
import {
    makeStyles,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Fab
} from '@material-ui/core';
import {
    DynamicFeed,
    AccountCircle,
    PostAdd,
    Subscriptions,
    ExitToApp,
    People
} from '@material-ui/icons'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import UserAvatar from '../user/UserAvatar';
import UserLink from '../user/UserLink';
import { useUserMe } from '../user/hooks';
const useFabStyles = makeStyles(theme => ({
    fabContainer: {
        margin: theme.spacing(2),
        display: 'flex',
        justifyContent: 'center'
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    }
}));
const FabPost = () => {
    const styles = useFabStyles();
    return <div className={styles.fabContainer}>
        <Fab
            component={Link}
            to="/post/create"
            color="primary"
            variant="extended"
        >
            <PostAdd className={styles.extendedIcon} />
        Post
        </Fab>
    </div>
};

const useIdentityStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        width: 50,
        height: 50
    }
}));
const Indentity = () => {
    const { data: user } = useQuery('me', () =>
        axios.get('/auth/me').then(res => res.data)
    );
    const styles = useIdentityStyles();
    return <div className={styles.container}>
        <UserAvatar _id={user._id} className={styles.avatar} />
        <UserLink _id={user._id} />
    </div>
};

const useNavStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
}));

const LogOut = () => {
    const queryClient = useQueryClient();
    const logOut = () => {
        axios.get('/auth/logout')
            .then(() => {
                queryClient.invalidateQueries('me');
            });
    }
    return <ListItem button onClick={logOut}>
        <ListItemIcon><ExitToApp  color="primary"/></ListItemIcon>
        <ListItemText primary="Log Out" />
    </ListItem>
}
const Nav = () => {
    const { data: user } = useUserMe();
    const styles = useNavStyles();
    return <div>
        <div className={styles.toolbar} />
        <Indentity />
        <FabPost />
        <Divider />
        <List>
            <ListItem button component={Link} to={`/user/${user._id}`}>
                <ListItemIcon><AccountCircle color="primary" /></ListItemIcon>
                <ListItemText primary="Profile" />
            </ListItem>
            <ListItem button component={Link} to="/">
                <ListItemIcon><DynamicFeed color="primary" /></ListItemIcon>
                <ListItemText primary="Feed" />
            </ListItem>
            <ListItem button component={Link} to="/subscription">
                <ListItemIcon><Subscriptions color="primary" /></ListItemIcon>
                <ListItemText primary="Subscription" />
            </ListItem>
            <ListItem button component={Link} to="/contact">
                <ListItemIcon><People color="primary" /></ListItemIcon>
                <ListItemText primary="Contacts" />
            </ListItem>
            <LogOut />
        </List>
        <Divider />
    </div>
};
export default Nav;
