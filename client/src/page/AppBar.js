import React from 'react';
import {
    makeStyles,
    AppBar,
    Toolbar,
    Typography,
    IconButton
} from '@material-ui/core';
import {
    Menu,
    Search
} from '@material-ui/icons'
import { Link } from 'react-router-dom';
import PostNotification from '../notification/PostNotification';
import MessageNotification from '../notification/MessageNotification';
import FollowNotification from '../notification/FollowNotification';

const useStyles = makeStyles((theme) => ({
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${240}px)`,
            marginLeft: 240,
        },
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block'
        }
    },
    grow: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
}));


const CustomAppBar = ({ handleDrawerToggle }) => {
    const styles = useStyles();
    return <AppBar position="fixed" className={styles.appBar}>
        <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={styles.menuButton}
            >
                <Menu />
            </IconButton>
            <Typography variant="h6" noWrap className={styles.title}>
                
            </Typography>
            <div className={styles.grow} />
            <IconButton
                component={Link}
                to={'/search'}
                color="inherit" >
                <Search />
            </IconButton>
            <FollowNotification />
            <MessageNotification />
            <PostNotification />
        </Toolbar>
    </AppBar>
}

export default CustomAppBar;