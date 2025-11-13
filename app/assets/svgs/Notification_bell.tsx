import * as React from 'react';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function Notification_bell({ notifications }: { notifications: number }) {
  return (
    <Badge badgeContent={notifications} color="primary" className='cursor-pointer'>
      <NotificationsIcon color="action" />
    </Badge>
  );
}
