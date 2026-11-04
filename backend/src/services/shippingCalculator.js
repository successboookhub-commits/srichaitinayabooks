import { shippingConfig } from '../config/shipping.js';

export class ShippingCalculator {
  static calculate(cart = []) {
    let subtotal = 0;
    let normalShipping = 0;
    const weightlessItems = [];

    for (const item of cart) {
      const qty = parseInt(item.qty || 1, 10);
      const price = parseFloat(item.price || 0);

      subtotal += price * qty;

      if (item.is_weightless) {
        weightlessItems.push(item);
      } else {
        normalShipping += parseFloat(item.shipping || 0) * qty;
      }
    }

    const weightlessShipping = this.calculateWeightlessShipping(weightlessItems);
    const shipping = normalShipping + weightlessShipping;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round((subtotal + shipping) * 100) / 100,
    };
  }

  static calculateWeightlessShipping(weightlessItems = []) {
    if (!weightlessItems.length) return 0;

    const totalQty = weightlessItems.reduce((acc, item) => acc + parseInt(item.qty || 1, 10), 0);
    if (totalQty <= 0) return 0;

    const firstItemShipping = parseFloat(weightlessItems[0].shipping || 0);
    if (totalQty <= 1) {
      return firstItemShipping * totalQty;
    }

    const extraUnits = totalQty - 1;
    return firstItemShipping + (extraUnits * shippingConfig.weightless_extra_charge);
  }
}

