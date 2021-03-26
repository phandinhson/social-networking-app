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
    Container,
    makeStyles
} from '@material-ui/core';
import { Message } from '@material-ui/icons';
import {
    useMessageNotifications,
    useMessageNotificationsCount
} from './hooks';
import UserAvatar from '../user/UserAvatar';
import { Link } from 'react-router-dom';
import { useUser } from '../user/hooks';

const useStyles = makeStyles(theme => ({
    noWrap: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    loader: { margin: 10 }
}));

const Icon = (props) => {
    const { data: count } = useMessageNotificationsCount();
    const icon = <Message {...props} />;
    return count ?
        <Badge
            badgeContent={count}
            color="secondary"
        >
            {icon}
        </Badge> :
        icon;
};

const Item = ({ from_id, text }) => {
    const styles = useStyles();
    const { data: user } = useUser(from_id);
    return <ListItem button component={Link} to={`/message/${from_id}`}>
        <ListItemAvatar>
            <UserAvatar _id={from_id} />
        </ListItemAvatar>
        <ListItemText
            primary={user ? `${user.firstName} ${user.lastName}` : 'New message'}
            secondary={text}
            className={styles.noWrap}
        />
    </ListItem>
};

const NotificationsPopover = props => {
    let { data: notifications, isLoading } = useMessageNotifications();
    const styles = useStyles();
    let notificationList;
    if (isLoading)
        notificationList = <CircularProgress className={styles.loader} />;
    else {
        notifications = [...notifications].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        notificationList =
            notifications.length > 0
                ? <List dense>{
                    notifications.map(n =>
                        <Item
                            from_id={n._id}
                            text={n.preview}
                            key={n._id}
                        />
                    )
                }</List>
                : <Typography variant="body1">No notifications.</Typography>;
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