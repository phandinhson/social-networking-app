import React from 'react';
import axios from 'axios';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import { useWebSocketListener } from '../websocket/hooks';
import flatten from '../utils/flatten';
export const usePostNotificationsCount = () => {
    const query = useQuery(['notification', 'post', 'count'], () =>
        axios.get('/notification/post/count').then(res => res.data)
    );
    const { refetch } = query;
    useWebSocketListener('notification/post', refetch);
    return query;
};

export const usePostNotifications = () => {
    const query = useInfiniteQuery(['notification', 'post'],
        ({ pageParam }) =>
            axios.get(`/notification/post${pageParam ? `?cursor=${pageParam}` : ''}`)
                .then(res => res.data),
        { getNextPageParam: last => last[last.length - 1]?._id }
    )
    const { data, isLoading, refetch } = query;
    useWebSocketListener('notification/post', refetch);
    const notifications = !isLoading && flatten(data.pages);
    React.useEffect(() => {
        if (notifications) {
            const unseen = notifications.filter(n => !n.seen).map(n => n._id);
            if (unseen.length > 0) {
                axios.delete('/notification/post', { data: unseen });
            }
        }
    });
    return { ...query, data: notifications };
};

export const useMessageNotificationsCount = () => {
    const query = useQuery(['notification', 'message', 'count'],
        () => axios.get('/notification/message/count').then(res => res.data)
    );
    const { refetch } = query;
    useWebSocketListener('notification/message', refetch);
    return query;
};

export const useMessageNotifications = () => {
    const query = useQuery(['notification', 'message'], () =>
        axios.get('/notification/message').then(res => res.data)
    );
    const { data: notifications, refetch } = query;
    useWebSocketListener('notification/message', refetch);
    const queryClient = useQueryClient();
    React.useEffect(() => {
        if (notifications?.some(n => !n.seen)) {
            axios.delete('/notification/message')
                .then(() => {
                    queryClient.setQueryData(['notification', 'message', 'count'], 0)
                });
        }
    }, [notifications, queryClient]);
    return query;
};

export const useFollowNotificationsCount = () => {
    const query = useQuery(['notification', 'follow', 'count'],
        () => axios.get('/notification/follow/count').then(res => res.data)
    );
    const { refetch } = query;
    useWebSocketListener('notification/follow', refetch);
    return query;
};

export const useFollowNotifications = () => {
    const query = useQuery(['notification', 'follow'], () =>
        axios.get('/notification/follow').then(res => res.data)
    );
    const { data: notifications, refetch } = query;
    useWebSocketListener('notification/follow', refetch);
    const queryClient = useQueryClient();
    React.useEffect(() => {
        if (notifications) {
            const unseen = notifications.filter(n => !n.seen);
            if (unseen.length > 0) {
                axios.delete('/notification/follow')
                    .then(() => {
                        queryClient.setQueryData(
                            ['notification', 'follow', 'count'],
                            count => count - unseen.length
                        )
                    });
            }
        }
    }, [notifications, queryClient]);
    return query;
};
