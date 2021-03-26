import { Typography, Link } from '@material-ui/core';
import React from 'react';
import { useUser } from './hooks';
import { Link as RouterLink } from 'react-router-dom';

const UserLink = ({ _id }) => {
    const { data: user, isLoading } = useUser(_id);
    if (isLoading) return null;
    return <Typography variant="subtitle1">
        <Link component={RouterLink} to={`/user/${_id}`}>
            {`${user.firstName} ${user.lastName}`}
        </Link>
    </Typography>
};

export default UserLink;