<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'customers';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'country',
        'state',
        'district',
        'mandal',
        'door_no',
        'address',
        'pincode',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }
}
