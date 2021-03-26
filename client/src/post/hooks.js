import React from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from "react-query";
import { WebSocketContext } from "../websocket/WebSocketContext";

export const usePost = _id => {
    const query = useQuery(['post', _id], () =>
        axios.get(`/post/${_id}`).then(res => res.data)
    );
    const queryClient = useQueryClient();
    const { socket } = React.useContext(WebSocketContext);
    React.useEffect(() => {
        const onPostUpdated = post => {
            queryClient.setQueryData(['post', _id], post);
        }
        socket.on(`post/${_id}`, onPostUpdated);
        return () => socket.off(`post/${_id}`, onPostUpdated);
    }, [socket, queryClient, _id])
    return query;
};

