import client from './client';
import { DEMO_MODE } from '../config/constants';

export const verifyPayment = async (paymentData) => {
  if (DEMO_MODE) {
    return {
      paymentStatus: 'PAID',
      razorpay_payment_id: 'pay_demo_' + Math.random().toString(36).substr(2, 9),
    };
  }

  const response = await client.post('/payments/verify', paymentData);
  return response.data.data;
};
