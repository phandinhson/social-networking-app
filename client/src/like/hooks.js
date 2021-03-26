import axios from 'axios';
import React from 'react';
import { useQuery } from 'react-query';
import { WebSocketContext } from '../websocket/WebSocketContext';
import { useWebSocketListener } from '../websocket/hooks';
export const useLikes = (post_id) => {
    const query = useQuery(['like', post_id], () =>
        axios.get(`/like/${post_id}`).then(res => res.data)
    );
    const { refetch } = query;
    const { socket } = React.useContext(WebSocketContext);
    React.useEffect(() => {
        socket.on(`like/${post_id}`, refetch);
        return () => socket.off(`like/${post_id}`, refetch);
    }, [socket, refetch, post_id]);
    return query;
};

export const useLikesCount = (post_id) => {
    const query = useQuery(['like', post_id, 'count'], () =>
        axios.get(`/like/count/${post_id}`).then(res => res.data)
    );
    const { refetch } = query;
    const { socket } = React.useContext(WebSocketContext);
    React.useEffect(() => {
        socket.on(`like/${post_id}`, refetch);
        return () => socket.off(`like/${post_id}`, refetch);
    }, [socket, refetch, post_id]);
    return query;
}

export const useIsLiked = post_id => {
    const query = useQuery(['like', post_id, 'isliked'], () =>
        axios.get(`/like/isliked/${post_id}`).then(res => res.data)
    );
    const { refetch } = query;
    useWebSocketListener(`like/${post_id}`, refetch);
    return query;
}