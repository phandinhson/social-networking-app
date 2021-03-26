
import Axios from 'axios';
import React from 'react';
import { WebSocketContext } from '../websocket/WebSocketContext';
import { useQuery } from 'react-query';

export const useIsFollowing = (_id) => {
    const query = useQuery(['follow', _id, 'isFollowing'], () =>
        Axios.get(`/follow/isFollowing/${_id}`).then(res => res.data)
    );
    const { refetch } = query;
    const { socket } = React.useContext(WebSocketContext);
    React.useEffect(() => {
        socket.on(`follower/${_id}`, refetch);
        return () => socket.off(`follower/${_id}`, refetch);
    }, [socket, _id, refetch]);
    return query;
};

export const useFollowersCount = (_id) => {
    const query = useQuery(['follow', _id, 'count'], () =>
        Axios.get(`/follow/count/${_id}`).then(res => res.data)
    );
    const { refetch } = query;
    const { socket } = React.useContext(WebSocketContext);
    React.useEffect(() => {
        socket.on(`follower/${_id}`, refetch);
        return () => socket.off(`follower/${_id}`, refetch);
    }, [socket, _id, refetch]);
    return query;
};