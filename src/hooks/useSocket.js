import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../redux/slices/notificationSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.id) return;

    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current.emit('join', user.id);

    socketRef.current.on('notification', (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user?.id, dispatch]);

  return socketRef.current;
};
