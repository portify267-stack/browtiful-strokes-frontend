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
