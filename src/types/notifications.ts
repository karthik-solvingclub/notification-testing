// Notification types for Plattr app
export enum NotificationType {
  ORDER_STATUS = 'order_status',
  ORDER_CONFIRMED = 'order_confirmed',
  ORDER_PREPARING = 'order_preparing',
  ORDER_READY = 'order_ready',
  ORDER_OUT_FOR_DELIVERY = 'order_out_for_delivery',
  ORDER_DELIVERED = 'order_delivered',
  ORDER_CANCELLED = 'order_cancelled',
  PROMOTION = 'promotion',
  REMINDER = 'reminder',
  DELIVERY_UPDATE = 'delivery_update',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  MEAL_REMINDER = 'meal_reminder',
  BULK_ORDER_UPDATE = 'bulk_order_update',
  CATERING_UPDATE = 'catering_update',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface BaseNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  priority: NotificationPriority;
  timestamp: Date;
  read: boolean;
  data?: Record<string, any>;
  imageUrl?: string;
  actionUrl?: string;
}

export interface OrderStatusNotification extends BaseNotification {
  type: NotificationType.ORDER_STATUS | NotificationType.ORDER_CONFIRMED | 
        NotificationType.ORDER_PREPARING | NotificationType.ORDER_READY | 
        NotificationType.ORDER_OUT_FOR_DELIVERY | NotificationType.ORDER_DELIVERED | 
        NotificationType.ORDER_CANCELLED;
  data: {
    orderId: string;
    orderNumber?: string;
    status: string;
    estimatedTime?: number; // minutes
    deliveryAddress?: string;
  };
}

export interface PromotionNotification extends BaseNotification {
  type: NotificationType.PROMOTION;
  data: {
    promotionId: string;
    discount?: number;
    code?: string;
    validUntil?: Date;
  };
}

export interface ReminderNotification extends BaseNotification {
  type: NotificationType.REMINDER | NotificationType.MEAL_REMINDER;
  data: {
    reminderType: string;
    scheduledTime?: Date;
  };
}

export interface DeliveryNotification extends BaseNotification {
  type: NotificationType.DELIVERY_UPDATE;
  data: {
    orderId: string;
    deliveryPersonName?: string;
    deliveryPersonPhone?: string;
    estimatedArrival?: Date;
    trackingUrl?: string;
  };
}

export interface PaymentNotification extends BaseNotification {
  type: NotificationType.PAYMENT_SUCCESS | NotificationType.PAYMENT_FAILED;
  data: {
    orderId: string;
    amount: number;
    transactionId?: string;
    paymentMethod?: string;
  };
}

export type PlattrNotification = 
  | OrderStatusNotification 
  | PromotionNotification 
  | ReminderNotification 
  | DeliveryNotification 
  | PaymentNotification;

export interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  reminders: boolean;
  deliveryUpdates: boolean;
  paymentUpdates: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}
