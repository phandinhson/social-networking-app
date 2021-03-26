import GoogleLoginInner from 'react-google-login';
import Axios from 'axios';
import React from 'react';
import { useQueryClient } from 'react-query';

export const GoogleLogIn = () => {
    const queryClient = useQueryClient();
    const onSuccess = response => {
        Axios.post('/auth/google', { idToken: response.tokenId })
            .then(() => queryClient.invalidateQueries('me'));
    }
    return <GoogleLoginInner
        clientId="673272954593-23ub07tleruocinbqur2k26nbitgdu8i.apps.googleusercontent.com"
        onSuccess={onSuccess}
        cookiePolicy={'single_host_origin'}
    />
};