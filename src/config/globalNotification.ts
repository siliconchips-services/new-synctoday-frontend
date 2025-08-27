import { NotificationInstance } from 'antd/es/notification/interface';

let notificationInstance: NotificationInstance | null = null;

export const setGlobalNotification = (instance: NotificationInstance) => {
  notificationInstance = instance;
};

export const Notification = {
  success: (data: any) => {
    notificationInstance?.success({
      placement: data?.placement || 'bottomRight',
      duration: 2,
      ...data,
    });
  },
  error: (data: any) => {
    notificationInstance?.error({
      placement: data?.placement || 'bottomRight',
      duration: 2,
      ...data,
    });
  },
};
