import { 
  PlattrNotification, 
  NotificationType, 
  NotificationPriority,
  OrderStatusNotification,
  PromotionNotification,
  ReminderNotification,
  DeliveryNotification,
  PaymentNotification
} from '../types/notifications';

// Helper functions to create different notification types

export const createOrderStatusNotification = (
  orderId: string,
  status: string,
  orderNumber?: string,
  estimatedTime?: number,
  deliveryAddress?: string
): OrderStatusNotification => {
  const statusMessages: Record<string, { title: string; body: string; type: NotificationType }> = {
    confirmed: {
      title: 'Order Confirmed! 🎉',
      body: `Your order #${orderNumber || orderId} has been confirmed and is being prepared.`,
      type: NotificationType.ORDER_CONFIRMED,
    },
    preparing: {
      title: 'Order Being Prepared 👨‍🍳',
      body: `Your order #${orderNumber || orderId} is being prepared with fresh ingredients.`,
      type: NotificationType.ORDER_PREPARING,
    },
    ready: {
      title: 'Order Ready! 🍽️',
      body: `Your order #${orderNumber || orderId} is ready for pickup/delivery.`,
      type: NotificationType.ORDER_READY,
    },
    out_for_delivery: {
      title: 'Out for Delivery 🚚',
      body: `Your order #${orderNumber || orderId} is on its way! Estimated arrival: ${estimatedTime || 30} minutes.`,
      type: NotificationType.ORDER_OUT_FOR_DELIVERY,
    },
    delivered: {
      title: 'Order Delivered! 📦',
      body: `Your order #${orderNumber || orderId} has been delivered. Enjoy your meal!`,
      type: NotificationType.ORDER_DELIVERED,
    },
    cancelled: {
      title: 'Order Cancelled',
      body: `Your order #${orderNumber || orderId} has been cancelled.`,
      type: NotificationType.ORDER_CANCELLED,
    },
  };

  const message = statusMessages[status.toLowerCase()] || {
    title: 'Order Update',
    body: `Your order #${orderNumber || orderId} status: ${status}`,
    type: NotificationType.ORDER_STATUS as NotificationType.ORDER_STATUS,
  };

  return {
    id: `order-${orderId}-${Date.now()}`,
    type: message.type as NotificationType.ORDER_STATUS | NotificationType.ORDER_CONFIRMED | 
          NotificationType.ORDER_PREPARING | NotificationType.ORDER_READY | 
          NotificationType.ORDER_OUT_FOR_DELIVERY | NotificationType.ORDER_DELIVERED | 
          NotificationType.ORDER_CANCELLED,
    title: message.title,
    body: message.body,
    priority: status === 'delivered' || status === 'cancelled' ? NotificationPriority.HIGH : NotificationPriority.MEDIUM,
    timestamp: new Date(),
    read: false,
    data: {
      orderId,
      orderNumber,
      status,
      estimatedTime,
      deliveryAddress,
    },
    actionUrl: `/orders/${orderId}`,
  };
};

export const createPromotionNotification = (
  promotionId: string,
  title: string,
  body: string,
  discount?: number,
  code?: string,
  validUntil?: Date
): PromotionNotification => {
  return {
    id: `promo-${promotionId}-${Date.now()}`,
    type: NotificationType.PROMOTION,
    title: title || 'Special Promotion! 🎉',
    body: body || (discount ? `Get ${discount}% off on your next order!` : 'Check out our latest offers!'),
    priority: NotificationPriority.MEDIUM,
    timestamp: new Date(),
    read: false,
    data: {
      promotionId,
      discount,
      code,
      validUntil,
    },
    actionUrl: `/promotions/${promotionId}`,
  };
};

export const createReminderNotification = (
  reminderType: string,
  title: string,
  body: string,
  scheduledTime?: Date
): ReminderNotification => {
  return {
    id: `reminder-${reminderType}-${Date.now()}`,
    type: NotificationType.REMINDER,
    title: title || 'Reminder ⏰',
    body: body || 'Don\'t forget to place your order!',
    priority: NotificationPriority.LOW,
    timestamp: new Date(),
    read: false,
    data: {
      reminderType,
      scheduledTime,
    },
  };
};

export const createMealReminderNotification = (
  mealType: string,
  scheduledTime?: Date
): ReminderNotification => {
  return {
    id: `meal-reminder-${Date.now()}`,
    type: NotificationType.MEAL_REMINDER,
    title: `Time for ${mealType}! 🍽️`,
    body: `Don't forget to order your ${mealType} meal.`,
    priority: NotificationPriority.MEDIUM,
    timestamp: new Date(),
    read: false,
    data: {
      reminderType: mealType,
      scheduledTime,
    },
    actionUrl: '/menu',
  };
};

export const createDeliveryNotification = (
  orderId: string,
  deliveryPersonName?: string,
  deliveryPersonPhone?: string,
  estimatedArrival?: Date,
  trackingUrl?: string
): DeliveryNotification => {
  const eta = estimatedArrival 
    ? `Estimated arrival: ${estimatedArrival.toLocaleTimeString()}`
    : 'Your order is on the way!';

  return {
    id: `delivery-${orderId}-${Date.now()}`,
    type: NotificationType.DELIVERY_UPDATE,
    title: 'Delivery Update 📍',
    body: `${eta}${deliveryPersonName ? ` Delivery person: ${deliveryPersonName}` : ''}`,
    priority: NotificationPriority.HIGH,
    timestamp: new Date(),
    read: false,
    data: {
      orderId,
      deliveryPersonName,
      deliveryPersonPhone,
      estimatedArrival,
      trackingUrl,
    },
    actionUrl: trackingUrl || `/orders/${orderId}/track`,
  };
};

export const createPaymentNotification = (
  orderId: string,
  success: boolean,
  amount: number,
  transactionId?: string,
  paymentMethod?: string
): PaymentNotification => {
  return {
    id: `payment-${orderId}-${Date.now()}`,
    type: success ? NotificationType.PAYMENT_SUCCESS : NotificationType.PAYMENT_FAILED,
    title: success ? 'Payment Successful! 💳' : 'Payment Failed ⚠️',
    body: success
      ? `Payment of ₹${amount} for order #${orderId} was successful.`
      : `Payment of ₹${amount} for order #${orderId} failed. Please try again.`,
    priority: success ? NotificationPriority.MEDIUM : NotificationPriority.HIGH,
    timestamp: new Date(),
    read: false,
    data: {
      orderId,
      amount,
      transactionId,
      paymentMethod,
    },
    actionUrl: success ? `/orders/${orderId}` : `/orders/${orderId}/payment`,
  };
};
