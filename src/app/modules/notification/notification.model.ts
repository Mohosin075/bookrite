import { Schema, model } from 'mongoose';

const notificationSchema = new Schema(
  {
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    from: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: [
        'booking_request',
        'booking_accepted',
        'booking_rejected',
        'booking_reminder',
        'new_message',
        'new_review',
        'service_deactivated',
        'admin_announcement',
      ],
      required: true,
    },
    message: { type: String, required: true },
    metadata: { type: Object },
    isRead: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const Notification = model('Notification', notificationSchema);
