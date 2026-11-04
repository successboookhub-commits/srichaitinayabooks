<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Services\ShippingCalculator;

class CartController extends Controller
{
    // ADD PRODUCT TO CART
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity'   => 'nullable|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        if (!$product->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'This product is currently unavailable.',
            ], 400);
        }

        if ($product->quantity <= 0) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, this product is out of stock.',
            ], 400);
        }

        $cart = session()->get('cart', []);
        $qty  = (int) ($request->quantity ?? 1);

        $existingQty = isset($cart[$product->id]) ? $cart[$product->id]['qty'] : 0;
        if (($existingQty + $qty) > $product->quantity) {
            return response()->json([
                'success' => false,
                'message' => "Only {$product->quantity} unit(s) available in stock.",
            ], 400);
        }

        if (isset($cart[$product->id])) {
            $cart[$product->id]['qty'] += $qty;
        } else {
            $cart[$product->id] = [
                'id'            => $product->id,
                'name'          => $product->name,
                'price'         => (float) $product->total_price,
                'shipping'      => (float) $product->shipping_charge,
                'qty'           => $qty,
                'image'         => $product->main_photo,
                'is_weightless' => (bool) $product->is_weightless,
            ];
        }

        session()->put('cart', $cart);

        $calc = ShippingCalculator::calculate($cart);

        return response()->json([
            'success'  => true,
            'count'    => array_sum(array_column($cart, 'qty')),
            'subtotal' => $calc['subtotal'],
            'shipping' => $calc['shipping'],
            'total'    => $calc['total'],
        ]);
    }

    // CART PAGE
    public function index()
    {
        $cart = session()->get('cart', []);
        $calc = ShippingCalculator::calculate($cart);

        return view('cart.index', [
            'cart'     => $cart,
            'subtotal' => $calc['subtotal'],
            'shipping' => $calc['shipping'],
            'total'    => $calc['total'],
        ]);
    }

    // UPDATE QUANTITY (+ / - BUTTON)
    public function update(Request $request)
    {
        $cart = session()->get('cart', []);
        $id   = (int) $request->id;
        $qty  = max(1, (int) $request->qty);

        if (isset($cart[$id])) {
            $product = Product::find($id);
            if ($product && $qty > $product->quantity) {
                $qty = $product->quantity;
            }

            $cart[$id]['qty'] = $qty;
            session()->put('cart', $cart);
        }

        $calc = ShippingCalculator::calculate($cart);

        return response()->json([
            'itemTotal' => isset($cart[$id]) ? $cart[$id]['price'] * $cart[$id]['qty'] : 0,
            'subtotal'  => $calc['subtotal'],
            'shipping'  => $calc['shipping'],
            'total'     => $calc['total'],
        ]);
    }

    // REMOVE ITEM
    public function remove(Request $request)
    {
        $cart = session()->get('cart', []);
        if (isset($cart[$request->id])) {
            unset($cart[$request->id]);
        }
        session()->put('cart', $cart);
        return back();
    }
}
