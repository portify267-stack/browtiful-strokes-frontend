import client from './client';
import { DEMO_MODE } from '../config/constants';

export const createOrder = async (orderData) => {
  if (DEMO_MODE) {
    const mockOrder = {
      _id: 'demo_' + Math.random().toString(36).substr(2, 9),
      ...orderData,
      paymentStatus: 'PAID',
      orderStatus: 'PREPARING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('browtiful_strokes_orders') || '[]');
    existingOrders.unshift(mockOrder);
    localStorage.setItem('browtiful_strokes_orders', JSON.stringify(existingOrders));
    
    return {
      order: mockOrder,
      razorpayOptions: {
        key: 'rzp_test_demo',
        amount: 0,
        currency: 'INR',
        name: 'Browtiful Strokes Studio',
        description: 'Demo Purchase',
        order_id: 'rzp_order_demo',
      }
    };
  }

  const response = await client.post('/orders', orderData);
  return response.data.data;
};

export const getOrderById = async (id, phone) => {
  if (DEMO_MODE) {
    const existingOrders = JSON.parse(localStorage.getItem('browtiful_strokes_orders') || '[]');
    const order = existingOrders.find((o) => o._id === id);
    return order || null;
  }

  const response = await client.get(`/orders/${id}`, { params: { phone } });
  return response.data.data;
};
