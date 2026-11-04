<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Customer;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | ORDERS LIST (Admin)
    |--------------------------------------------------------------------------
    */
    public function index(Request $request)
    {
        $search   = $request->search;
        $dateFrom = $request->date_from;
        $dateTo   = $request->date_to;

        $orders = Order::with(['customer', 'items'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    if (is_numeric($search)) {
                        $q->orWhere('id', $search);
                    }

                    $q->orWhere('order_code', 'LIKE', "%{$search}%");

                    $q->orWhereHas('customer', function ($c) use ($search) {
                        $c->where('name', 'LIKE', "%{$search}%")
                          ->orWhere('phone', 'LIKE', "%{$search}%");
                    });

                    $q->orWhereHas('items', function ($i) use ($search) {
                        $i->where('product_name', 'LIKE', "%{$search}%");
                    });
                });
            })
            ->when($dateFrom, function ($query) use ($dateFrom) {
                $query->where('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query) use ($dateTo) {
                $query->where('created_at', '<=', $dateTo);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return view('admin.orders.index', compact('orders', 'search', 'dateFrom', 'dateTo'));
    }

    /*
    |--------------------------------------------------------------------------
    | VIEW SINGLE ORDER
    |--------------------------------------------------------------------------
    */
    public function show($id)
    {
        $order = Order::with(['customer', 'items'])->findOrFail($id);

        return view('admin.orders.show', compact('order'));
    }

    /*
    |--------------------------------------------------------------------------
    | DOWNLOAD INVOICE PDF
    |--------------------------------------------------------------------------
    */
    public function download($id)
    {
        $order = Order::with(['customer', 'items'])->findOrFail($id);

        $pdf = Pdf::loadView('admin.orders.invoice', compact('order'))
                    ->setPaper('A4', 'portrait');

        return $pdf->stream("Invoice-{$order->order_code}.pdf");
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE ORDER STATUS
    |--------------------------------------------------------------------------
    */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'status' => 'required|string'
        ]);

        $order->status = $request->status;
        $order->save();

        return redirect()->back()->with('success', 'Payment status updated successfully!');
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE ORDER
    |--------------------------------------------------------------------------
    */
    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        OrderItem::where('order_id', $order->id)->delete();
        $order->delete();

        return redirect()->route('admin.orders.index')
            ->with('success', 'Order deleted successfully!');
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        $request->validate([
            'order_status' => 'required|string'
        ]);

        $order->order_status = $request->order_status;
        $order->save();

        return back()->with('success', 'Order status updated!');
    }

    public function printLabel($id)
    {
        $order = Order::with(['customer', 'items'])->findOrFail($id);
        return view('admin.orders.label', compact('order'));
    }

    /*
    |--------------------------------------------------------------------------
    | PRINT LABELS FOR MULTIPLE ORDERS AT ONCE
    |--------------------------------------------------------------------------
    */
    public function printLabelsBulk(Request $request)
    {
        $idsParam = $request->query('ids');
        $ids = $idsParam ? array_filter(explode(',', $idsParam)) : [];

        $query = Order::with(['customer', 'items']);

        if (!empty($ids)) {
            $query->whereIn('id', $ids)->orderBy('id');
        } elseif ($request->filled('date_from') || $request->filled('date_to')) {
            if ($request->filled('date_from')) {
                $query->where('created_at', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $query->where('created_at', '<=', $request->date_to);
            }
            $query->orderBy('created_at');
        } else {
            abort(400, 'Select at least one order, or a date range, to print labels.');
        }

        $orders = $query->get();

        if ($orders->isEmpty()) {
            abort(404, 'No orders found for the selected criteria.');
        }

        return view('admin.orders.label-bulk', compact('orders'));
    }

    /*
    |--------------------------------------------------------------------------
    | SCAN BARCODE PAGE
    |--------------------------------------------------------------------------
    */
    public function scanForm()
    {
        return view('admin.orders.scan');
    }

    public function scanLookupCourier(Request $request)
    {
        $code = trim($request->query('code', ''));

        if ($code === '') {
            return response("ERROR\tNo barcode provided", 200, [
                'Content-Type' => 'text/plain; charset=UTF-8'
            ]);
        }

        $order = Order::with('customer')
            ->where('order_code', $code)
            ->first();

        if (!$order) {
            return response("ERROR\tNo order found for barcode: {$code}", 200, [
                'Content-Type' => 'text/plain; charset=UTF-8'
            ]);
        }

        $customer = $order->customer;

        if (!$customer) {
            return response("ERROR\tCustomer not found for barcode: {$code}", 200, [
                'Content-Type' => 'text/plain; charset=UTF-8'
            ]);
        }

        $clean = function ($value) {
            return trim(str_replace(["\t", "\r", "\n"], ' ', (string) ($value ?? '')));
        };

        // Complete full shipping address for courier
        $fullAddress = $clean(trim(implode(', ', array_filter([
            $customer->door_no ?? '',
            $customer->address ?? '',
            $customer->mandal ?? '',
            $customer->district ?? '',
            $customer->state ?? '',
            $customer->pincode ?? '',
        ])), ', '));

        $fields = [
            'OK',
            $clean($order->order_code),
            $clean($customer->pincode ?? ''),
            $clean($customer->name ?? ''),
            $fullAddress,
            $clean($customer->phone ?? ''),
        ];

        return response(implode("\t", $fields), 200, [
            'Content-Type'  => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma'        => 'no-cache',
            'Expires'       => '0',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | BULK UPDATE ORDER STATUS FOR SELECTED ORDERS
    |--------------------------------------------------------------------------
    */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'order_ids'    => 'required|array|min:1',
            'order_ids.*'  => 'integer',
            'order_status' => 'required|string',
        ]);

        $count = Order::whereIn('id', $request->order_ids)
            ->update(['order_status' => $request->order_status]);

        return back()->with('success', "{$count} order(s) updated to \"{$request->order_status}\".");
    }

    /*
    |--------------------------------------------------------------------------
    | BULK UPDATE ORDER STATUS FOR DATE RANGE
    |--------------------------------------------------------------------------
    */
    public function bulkUpdateStatusByDate(Request $request)
    {
        $request->validate([
            'date_from'    => 'required|date',
            'date_to'      => 'required|date|after_or_equal:date_from',
            'order_status' => 'required|string',
        ]);

        $count = Order::where('created_at', '>=', $request->date_from)
            ->where('created_at', '<=', $request->date_to)
            ->update(['order_status' => $request->order_status]);

        return back()->with(
            'success',
            "{$count} order(s) between {$request->date_from} and {$request->date_to} updated to \"{$request->order_status}\"."
        );
    }
}
