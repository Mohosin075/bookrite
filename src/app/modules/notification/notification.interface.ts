export type NotificationType =
  | 'booking_request'
  | 'booking_accepted'
  | 'booking_rejected'
  | 'booking_reminder'
  | 'new_message'
  | 'new_review'
  | 'service_deactivated'
  | 'admin_announcement';

interface BookingMetadata {
  bookingId: string;
  serviceId: string;
  date: string;
  time: string;
}

interface MessageMetadata {
  chatId: string;
  messageId: string;
}

interface ReviewMetadata {
  serviceId: string;
  reviewId: string;
}

interface AdminMetadata {
  reason?: string;
}

export interface INotificationBase {
  to: string;
  from?: string;
  message: string;
  isRead?: boolean;
}

export type INotification =
  | (INotificationBase & { type: 'booking_request'; metadata: BookingMetadata })
  | (INotificationBase & {
      type: 'booking_accepted';
      metadata: BookingMetadata;
    })
  | (INotificationBase & {
      type: 'booking_rejected';
      metadata: BookingMetadata;
    })
  | (INotificationBase & {
      type: 'booking_reminder';
      metadata: BookingMetadata;
    })
  | (INotificationBase & { type: 'new_message'; metadata: MessageMetadata })
  | (INotificationBase & { type: 'new_review'; metadata: ReviewMetadata })
  | (INotificationBase & {
      type: 'service_deactivated';
      metadata: AdminMetadata;
    })
  | (INotificationBase & {
      type: 'admin_announcement';
      metadata: AdminMetadata;
    });
