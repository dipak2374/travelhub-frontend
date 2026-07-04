import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markRead } from '../redux/slices/notificationSlice';
import { useSocket } from '../hooks/useSocket';

const Notifications = () => {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector((state) => state.notifications);
  useSocket();

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = (id) => {
    dispatch(markRead(id));
    import('../services').then(({ notificationAPI }) => notificationAPI.markRead(id));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="section-title">Notifications</h1>
        {unreadCount > 0 && (
          <span className="text-sm text-primary-600">{unreadCount} unread</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-8 text-center text-gray-500">No notifications yet</div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleMarkRead(n._id)}
              className={`card p-4 cursor-pointer transition-colors ${
                !n.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/30 dark:bg-primary-900/10' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                </div>
                <span className="text-xs text-gray-400 capitalize">{n.type}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
