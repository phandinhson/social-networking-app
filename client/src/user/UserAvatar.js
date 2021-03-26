import { Avatar, Badge, withStyles } from '@material-ui/core';
import React from 'react';
import { useUser } from './hooks';

const StyledBadge = withStyles((theme) => ({
    badge: {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: '$ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))(Badge);

const OnlineAvatar = ({ children }) => (
    <span>
        <StyledBadge
            overlap="circle"
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            variant="dot"
        >
            {children}
        </StyledBadge>
    </span>
);
const UserAvatar = ({ _id, ...restProps }) => {
    const { data: user } = useUser(_id);
    if (!user) return <Avatar  {...restProps} />;
    const avatar = user.avatar ?
        <Avatar src={`/${user.avatar}`} {...restProps} /> :
        <Avatar  {...restProps} />
    return user.lastActive ?
        avatar :
        <OnlineAvatar>{avatar}</OnlineAvatar>

};
export default UserAvatar;