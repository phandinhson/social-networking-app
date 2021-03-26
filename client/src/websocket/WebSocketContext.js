import React from 'react';
import { io } from 'socket.io-client';
import { useUserMe } from '../user/hooks';

export const WebSocketContext = React.createContext();
export const WebSocketProvider = ({ children }) => {
    const [socket, setSocket] = React.useState();
    const { data: user } = useUserMe();
    React.useEffect(() => {
        let newSocket = io();
        newSocket.on('connect', () => {
            setSocket(newSocket);
        });
        return () => newSocket.disconnect();
    }, [user?._id]);
    return <WebSocketContext.Provider value={{ socket }}>
        {socket && children}
    </WebSocketContext.Provider>
};