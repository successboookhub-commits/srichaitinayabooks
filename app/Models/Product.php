<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'category_ids',
        'publication_id',
        'name',
        'slug',
        'old_price',
        'discount',
        'total_price',
        'quantity',
        'weight',
        'is_weightless',
        'shipping_charge',
        'main_photo',
        'related_photos',
        'description',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'category_ids'   => 'array',
        'related_photos' => 'array',
        'is_featured'    => 'boolean',
        'is_active'      => 'boolean',
        'is_weightless'  => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name) . '-' . uniqid();
            }
        });
    }

    /* ✅ GET CATEGORY LIST (CACHED ACCESSOR) */
    public function getCategoryListAttribute()
    {
        if (empty($this->category_ids)) {
            return collect();
        }

        static $catCache = null;
        if ($catCache === null) {
            $catCache = Category::all()->keyBy('id');
        }

        $ids = is_array($this->category_ids) ? $this->category_ids : explode(' ', trim((string)$this->category_ids));
        return collect($ids)->map(fn($id) => $catCache->get($id))->filter();
    }

    /* ✅ PUBLICATION RELATION */
    public function publication()
    {
        return $this->belongsTo(Publication::class);
    }
}
