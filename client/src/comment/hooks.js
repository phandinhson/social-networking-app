import axios from 'axios';
import { useQuery } from 'react-query';
import { useWebSocketListener } from '../websocket/hooks';

export const useCommentsCount = (post_id) => {
    const query = useQuery(['comment', { post_id }, 'count'], () =>
        axios.get(`/comment/post/count/${post_id}`).then(res => res.data)
    );
    const { refetch } = query;
    useWebSocketListener(`comment/post/${post_id}`, refetch);
    return query;
}

export const usePostComments = post_id => {
    const query = useQuery(['comment', { post_id }], () =>
        axios.get(`/comment/post/${post_id}`).then(res => res.data)
    );
    const { refetch } = query;
    useWebSocketListener(`comment/post/${post_id}`, refetch);
    return query;
}

export const useReplies = root => {
    const query = useQuery(['comment', { comment_id: root._id }],
        () => axios.get(`/comment/reply/${root._id}`).then(res => res.data)
    );
    const { refetch } = query;
    useWebSocketListener(`comment/post/${root.post_id}`, refetch);
    return query;
}

export const useRepliesCount = (root) => {
    const query = useQuery(['comment', { comment_id: root._id }, 'count'],
        () => axios.get(`/comment/reply/count/${root._id}`).then(res => res.data)
    );
    const { refetch } = query;
    useWebSocketListener(`comment/post/${root.post_id}`, refetch);
    return query;
}