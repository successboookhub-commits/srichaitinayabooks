<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Customer;
use App\Models\OrderItem;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    /*
    |--------------------------------------------------------------------------
    | MASS ASSIGNABLE
    |--------------------------------------------------------------------------
    */
    protected $fillable = [
        'customer_id',
        'order_code',
        'subtotal',
        'shipping',
        'total',
        'status',
        'order_status',
        'razorpay_payment_id',
    ];

    /*
    |--------------------------------------------------------------------------
    | CASTS
    |--------------------------------------------------------------------------
    */
    protected $casts = [
        'subtotal'   => 'decimal:2',
        'shipping'   => 'decimal:2',
        'total'      => 'decimal:2',
        'created_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | CONSTANTS (BETTER STRUCTURE 🔥)
    |--------------------------------------------------------------------------
    */
    const ORDER_STATUS = [
        'Ordered'    => 'Ordered',
        'Processing' => 'Processing',
        'Packing'    => 'Packing',
        'Shipped'    => 'Shipped',
        'Delivered'  => 'Delivered',
    ];

    const PAYMENT_STATUS = [
        'Pending'   => 'Pending',
        'Paid'      => 'Paid',
        'Cancelled' => 'Cancelled',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    */
     public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
    
    

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS (UI FRIENDLY)
    |--------------------------------------------------------------------------
    */

    // ₹ Format
    public function getFormattedTotalAttribute()
    {
        return '₹' . number_format($this->total ?? 0, 2);
    }

    // Payment Status Badge
    public function getStatusBadgeAttribute()
    {
        return match ($this->status) {
            'Paid'      => 'badge-paid',
            'Cancelled' => 'badge-cancel',
            default     => 'badge-pending',
        };
    }

    // Order Status Badge
    public function getOrderStatusBadgeAttribute()
    {
        return match ($this->order_status) {
            'Processing' => 'badge-processing',
            'Packing'    => 'badge-packing',
            'Shipped'    => 'badge-shipped',
            'Delivered'  => 'badge-delivered',
            default      => 'badge-ordered',
        };
    }

    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */

    // Dropdown values
    public static function getOrderStatuses()
    {
        return array_values(self::ORDER_STATUS);
    }

    public static function getPaymentStatuses()
    {
        return array_values(self::PAYMENT_STATUS);
    }

    // Check Delivered
    public function isDelivered()
    {
        return $this->order_status === 'Delivered';
    }

    // Check Processing
    public function isProcessing()
    {
        return in_array($this->order_status, ['Processing', 'Packing']);
    }

    /*
    |--------------------------------------------------------------------------
    | 🔥 SEARCH SCOPE (VERY POWERFUL)
    |--------------------------------------------------------------------------
    */
    public function scopeSearch($query, $search)
    {
        if (!$search) return $query;

        return $query->where(function ($q) use ($search) {

            // Order ID
            if (is_numeric($search)) {
                $q->orWhere('id', $search);
            }

            // Order Code
            $q->orWhere('order_code', 'LIKE', "%{$search}%");

            // Customer Name
            $q->orWhereHas('customer', function ($c) use ($search) {
                $c->where('name', 'LIKE', "%{$search}%");
            });

            // Product Name (order_items table)
            $q->orWhereHas('items', function ($i) use ($search) {
                $i->where('product_name', 'LIKE', "%{$search}%");
            });

        });
    }
}