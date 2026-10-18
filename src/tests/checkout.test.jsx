import { describe, it, expect } from 'vitest';
import { checkoutSchema } from '../validation/checkoutSchema';

describe('Checkout Form Validation (Zod Schema)', () => {
  const validData = {
    customerName: 'Priya Sharma',
    phone: '9876543210',
    street: '12 Temple View Lane, T. Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zip: '600017',
    country: 'India',
  };

  it('should accept valid customer checkout information', () => {
    const result = checkoutSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.customerName).toBe('Priya Sharma');
      expect(result.data.country).toBe('India');
    }
  });

  it('should reject when customer name is too short', () => {
    const invalid = { ...validData, customerName: 'A' };
    const result = checkoutSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toContain('Name must be at least 2 characters');
  });

  it('should reject invalid phone numbers', () => {
    const invalid = { ...validData, phone: '123' };
    const result = checkoutSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject when street address is under 5 characters', () => {
    const invalid = { ...validData, street: 'St' };
    const result = checkoutSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toContain('Street address must be at least 5 characters');
  });

  it('should reject when city or state is missing', () => {
    const invalid = { ...validData, city: '' };
    const result = checkoutSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('should reject when postal code is invalid or missing', () => {
    const invalid = { ...validData, zip: '12' };
    const result = checkoutSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

import { calculateShipping } from '../utils/shippingUtils';

describe('Weight-Based Shipping Calculation (Chennai, Other TN, Other States)', () => {
  describe('Chennai (₹60 per kg)', () => {
    it('calculates 1 kg = ₹60', () => {
      const result = calculateShipping(1000, 'Tamil Nadu', 'Chennai');
      expect(result.chargeableWeightKg).toBe(1);
      expect(result.shippingRatePerKg).toBe(60);
      expect(result.shippingCharge).toBe(60);
      expect(result.shippingZone).toBe('Chennai');
    });

    it('calculates 2 kg = ₹120', () => {
      const result = calculateShipping(2000, 'Tamil Nadu', 'Chennai');
      expect(result.chargeableWeightKg).toBe(2);
      expect(result.shippingRatePerKg).toBe(60);
      expect(result.shippingCharge).toBe(120);
    });

    it('calculates 3 kg = ₹180', () => {
      const result = calculateShipping(3000, 'Tamil Nadu', 'Chennai');
      expect(result.chargeableWeightKg).toBe(3);
      expect(result.shippingCharge).toBe(180);
    });
  });

  describe('Other Tamil Nadu districts (₹80 per kg)', () => {
    it('calculates 1 kg = ₹80', () => {
      const result = calculateShipping(1000, 'Tamil Nadu', 'Coimbatore');
      expect(result.chargeableWeightKg).toBe(1);
      expect(result.shippingRatePerKg).toBe(80);
      expect(result.shippingCharge).toBe(80);
      expect(result.shippingZone).toBe('Tamil Nadu');
    });

    it('calculates 2 kg = ₹160', () => {
      const result = calculateShipping(2000, 'Tamil Nadu', 'Madurai');
      expect(result.chargeableWeightKg).toBe(2);
      expect(result.shippingRatePerKg).toBe(80);
      expect(result.shippingCharge).toBe(160);
    });

    it('calculates 3 kg = ₹240', () => {
      const result = calculateShipping(3000, 'Tamil Nadu', 'Salem');
      expect(result.chargeableWeightKg).toBe(3);
      expect(result.shippingCharge).toBe(240);
    });
  });

  describe('Other Indian States (₹110 per kg)', () => {
    it('calculates 1 kg = ₹110', () => {
      const result = calculateShipping(1000, 'Karnataka', 'Bengaluru');
      expect(result.chargeableWeightKg).toBe(1);
      expect(result.shippingRatePerKg).toBe(110);
      expect(result.shippingCharge).toBe(110);
      expect(result.shippingZone).toBe('Other States');
    });

    it('calculates 2 kg = ₹220', () => {
      const result = calculateShipping(2000, 'Maharashtra', 'Mumbai');
      expect(result.chargeableWeightKg).toBe(2);
      expect(result.shippingRatePerKg).toBe(110);
      expect(result.shippingCharge).toBe(220);
    });

    it('calculates 3 kg = ₹330', () => {
      const result = calculateShipping(3000, 'Delhi', 'New Delhi');
      expect(result.chargeableWeightKg).toBe(3);
      expect(result.shippingCharge).toBe(330);
    });
  });

  describe('Multi-product order total weight & fractional weights', () => {
    it('calculates shipping based on combined total order weight', () => {
      // 3 items: 500g, 250g, 250g = 1000g (1 kg)
      const items = [{ weight: 500, qty: 1 }, { weight: 250, qty: 2 }];
      const totalWeightInGrams = items.reduce((sum, i) => sum + i.weight * i.qty, 0);
      expect(totalWeightInGrams).toBe(1000);

      const chennai = calculateShipping(totalWeightInGrams, 'Tamil Nadu', 'Chennai');
      expect(chennai.shippingCharge).toBe(60);

      const otherTN = calculateShipping(totalWeightInGrams, 'Tamil Nadu', 'Trichy');
      expect(otherTN.shippingCharge).toBe(80);

      const otherState = calculateShipping(totalWeightInGrams, 'Kerala', 'Kochi');
      expect(otherState.shippingCharge).toBe(110);
    });

    it('handles fractional weights correctly rounding up to nearest kg with min 1kg', () => {
      // 250g (under 1kg) -> 1kg chargeable
      const under1kg = calculateShipping(250, 'Tamil Nadu', 'Chennai');
      expect(under1kg.chargeableWeightKg).toBe(1);
      expect(under1kg.shippingCharge).toBe(60);

      // 1200g (1.2kg) -> 2kg chargeable
      const over1kg = calculateShipping(1200, 'Karnataka', 'Bengaluru');
      expect(over1kg.chargeableWeightKg).toBe(2);
      expect(over1kg.shippingCharge).toBe(220);
    });
  });
});

import { buildRazorpayOptions } from '../utils/razorpayUtils';

describe('Razorpay Checkout Configuration', () => {
  const dummyOrder = {
    _id: 'order_test_123',
    customerName: 'Priya Sharma',
    phone: '9876543210',
    email: 'priya@example.com',
  };

  const dummyRazorpayOptions = {
    key: 'rzp_test_testkey123',
    amount: 150000,
    currency: 'INR',
    name: 'Browtiful Strokes',
    description: 'Order #order_test_123',
    order_id: 'order_rzp_456',
  };

  it('explicitly enables UPI and standard payment methods without restrictive display blocks', () => {
    const handler = () => {};
    const onDismiss = () => {};

    const options = buildRazorpayOptions({
      order: dummyOrder,
      razorpayOptions: dummyRazorpayOptions,
      handler,
      onDismiss,
    });

    expect(options.key).toBe('rzp_test_testkey123');
    expect(options.amount).toBe(150000);
    expect(options.currency).toBe('INR');
    expect(options.order_id).toBe('order_rzp_456');

    // Verify UPI and payment methods
    expect(options.method).toBeDefined();
    expect(options.method.upi).toBe(true);
    expect(options.method.card).toBe(true);
    expect(options.method.netbanking).toBe(true);
    expect(options.method.wallet).toBe(true);

    // Verify no restrictive config.display blocks hiding payment instruments
    expect(options.config).toBeUndefined();

    // Verify prefill fields
    expect(options.prefill.name).toBe('Priya Sharma');
    expect(options.prefill.contact).toBe('9876543210');
    expect(options.prefill.email).toBe('priya@example.com');
  });

  it('provides safe fallbacks for currency, name, and description when omitted', () => {
    const options = buildRazorpayOptions({
      order: { customerName: 'Deepa', phone: '9988776655' },
      razorpayOptions: { amount: 50000, order_id: 'order_abc' },
    });

    expect(options.currency).toBe('INR');
    expect(options.name).toBe('Browtiful Strokes');
    expect(options.description).toBe('Service Booking / Payment');
    expect(options.method.upi).toBe(true);
    expect(options.prefill.email).toBe('');
  });
});

