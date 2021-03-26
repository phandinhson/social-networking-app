import axios from 'axios';
import { useQuery } from 'react-query';
import { useWebSocketListener} from '../websocket/hooks';
export const useUser = (_id) => {
    const query = useQuery(['user', _id], () =>
        axios.get(`/user/${_id}`).then(res => res.data)
    );
    const { refetch } = query;
    useWebSocketListener(`user/${_id}`, refetch);
    return query;
};

export const useUserMe = () => {
    return useQuery('me', () =>
        axios.get('/auth/me').then(res => res.data)
    );
};