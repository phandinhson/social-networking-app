import { useContext, useEffect } from 'react';
import { WebSocketContext } from './WebSocketContext';

export const useWebSocketListener = (event, callback) => {
    const { socket } = useContext(WebSocketContext);
    useEffect(() => {
        socket.on(event, callback);
        return () => socket.off(event, callback);
    }, [socket, event, callback]);
}