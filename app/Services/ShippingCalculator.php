<?php

namespace App\Services;

/**
 * ShippingCalculator
 *
 * Single source of truth for turning a session cart array into
 * subtotal / shipping / total. Used by CartController (index + update)
 * and should also be used by your checkout page/controller so the
 * numbers never disagree between pages.
 *
 * Expected shape of each $cart item:
 * [
 *   'id'            => int,
 *   'name'          => string,
 *   'price'         => float,
 *   'image'         => string,
 *   'qty'           => int,
 *   'shipping'      => float,   // per-unit shipping charge, copied from product at add-to-cart time
 *   'is_weightless' => bool,    // copied from product at add-to-cart time
 * ]
 */
class ShippingCalculator
{
    public static function calculate(array $cart): array
    {
        $subtotal       = 0;
        $normalShipping = 0;
        $weightlessItems = [];

        foreach ($cart as $item) {
            $qty   = (int) ($item['qty'] ?? 1);
            $price = (float) ($item['price'] ?? 0);

            $subtotal += $price * $qty;

            if (!empty($item['is_weightless'])) {
                $weightlessItems[] = $item;
            } else {
                $normalShipping += (float) ($item['shipping'] ?? 0) * $qty;
            }
        }

        $weightlessShipping = self::calculateWeightlessShipping($weightlessItems);
        $shipping = $normalShipping + $weightlessShipping;

        return [
            'subtotal' => round($subtotal, 2),
            'shipping' => round($shipping, 2),
            'total'    => round($subtotal + $shipping, 2),
        ];
    }

    /**
     * Rule: the first "Weight Less" unit in the cart is charged its own
     * product's normal shipping charge. Every additional weightless unit
     * (regardless of which weightless product it is) adds a flat
     * config('shipping.weightless_extra_charge') instead of its own rate.
     */
    protected static function calculateWeightlessShipping(array $weightlessItems): float
    {
        if (empty($weightlessItems)) {
            return 0;
        }

        $totalQty = array_sum(array_map(fn ($i) => (int) ($i['qty'] ?? 1), $weightlessItems));

        if ($totalQty <= 0) {
            return 0;
        }

        $extraCharge = (float) config('shipping.weightless_extra_charge', 15);

        // "Normal" shipping charge for the first unit = the shipping_charge
        // stored on the first weightless item that was added to the cart.
        $firstItemShipping = (float) ($weightlessItems[0]['shipping'] ?? 0);

        if ($totalQty <= 1) {
            return $firstItemShipping * $totalQty;
        }

        $extraUnits = $totalQty - 1;

        return $firstItemShipping + ($extraUnits * $extraCharge);
    }
}
