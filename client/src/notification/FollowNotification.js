import React from 'react';
import {
    IconButton,
    List,
    ListItemAvatar,
    ListItemText,
    ListItem,
    Popover,
    Badge,
    CircularProgress,
    Typography,
    Container
} from '@material-ui/core';
import { People } from '@material-ui/icons';
import { useFollowNotifications, useFollowNotificationsCount } from './hooks';
import UserAvatar from '../user/UserAvatar';
import { Link } from 'react-router-dom';
import { useUser } from '../user/hooks';
const Icon = (props) => {
    const { data: count } = useFollowNotificationsCount();
    const icon = <People {...props} />;
    return count ?
        <Badge
            badgeContent={count}
            color="secondary"
        >
            {icon}
        </Badge> :
        icon;
};

const Item = ({ follower_id, createdAt }) => {
    const { data: user } = useUser(follower_id);
    return <ListItem button component={Link} to={`/user/${follower_id}`}>
        <ListItemAvatar>
            <UserAvatar _id={follower_id} />
        </ListItemAvatar>
        <ListItemText
            primary={user ? `${user.firstName} ${user.lastName} followed you.` : 'New follower.'}
            secondary={new Date(createdAt).toLocaleDateString()}
        />
    </ListItem>
};

const NotificationsPopover = props => {
    let { data: notifications, isLoading } = useFollowNotifications();
    let notificationList;
    if (isLoading)
        notificationList = <CircularProgress style={{ margin: '10px' }} />;
    else {
        notifications = [...notifications].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        notificationList =
            notifications.length > 0
                ? <List dense>{
                    notifications.map(n =>
                        <Item
                            follower_id={n.follower_id}
                            createdAt={n.createdAt}
                            key={n._id}
                        />
                    )}</List>
                : <Typography variant="body1">No notifications.</Typography>
            ;
    }
    return <Popover
        {...props}
        key={notifications}
    >
        <Container maxWidth="xs" disableGutters>
            {notificationList}
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
            <Icon />
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