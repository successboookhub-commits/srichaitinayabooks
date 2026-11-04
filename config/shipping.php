<?php

// config/shipping.php
//
// Central place for shipping-related numbers so the admin forms and the
// cart calculation always agree (previously create.blade.php used 70/kg
// while edit.blade.php used 60/kg — now both read from here).

return [

    // ₹ per KG, used to auto-calculate shipping_charge for normal
    // (weighted) products in the Add/Edit Product forms.
    'rate_per_kg' => 70,

    // Default flat shipping charge saved on a product when it is marked
    // "Weight Less" (no weight to calculate from). Admin can still edit
    // the Shipping Charge field manually before saving if a different
    // value is needed for that specific product.
    'weightless_base_charge' => 40,

    // Extra shipping added, per unit, for every "Weight Less" item in the
    // cart AFTER the first one. The first weightless unit is charged its
    // product's normal shipping_charge; every additional unit (of any
    // weightless product) adds this flat amount instead.
    'weightless_extra_charge' => 15,

];
