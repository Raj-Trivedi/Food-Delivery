// Coupon definitions for the cart
const coupons = [
  {
    code: 'Flat80',
    description: '₹80 off on orders above ₹699',
    discount: 80,
    minOrder: 699,
    firstTimeOnly: false
  },
  {
    code: 'First100',
    description: '₹100 off for first-time customers',
    discount: 100,
    minOrder: 0,
    firstTimeOnly: true
  },
  {
    code: 'Snack50',
    description: '₹50 off on orders above ₹399',
    discount: 50,
    minOrder: 399,
    firstTimeOnly: false
  },
  {
    code: 'Lunch20',
    description: '₹20 off on any order',
    discount: 20,
    minOrder: 0,
    firstTimeOnly: false
  }
];

export default coupons; 