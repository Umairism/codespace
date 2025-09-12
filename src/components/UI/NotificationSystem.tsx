import { useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface NotificationProps {
  notification: Notification;
  onClose: (id: string) => void;
}

function NotificationItem({ notification, onClose }: NotificationProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info
  };

  const colors = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500'
  };

  const Icon = icons[notification.type];

  return (
    <div className={`flex items-center p-4 mb-2 border-l-4 rounded ${colors[notification.type]} text-white`}>
      <Icon className="w-5 h-5 mr-3" />
      <span className="flex-1">{notification.message}</span>
      <button
        onClick={() => onClose(notification.id)}
        className="ml-3 text-white hover:text-gray-300"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface NotificationSystemProps {
  notifications: Notification[];
  onClose: (id: string) => void;
}

export function NotificationSystem({ notifications, onClose }: NotificationSystemProps) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    const notification: Notification = { id, type, message };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
    
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification
  };
}
