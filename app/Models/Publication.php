<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $table = 'publications';

    protected $fillable = [
        'name'
    ];

    // Relationship
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}