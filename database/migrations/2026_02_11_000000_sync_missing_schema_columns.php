<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'publication_id')) {
                $table->foreignId('publication_id')->nullable()->after('slug');
            }
            if (!Schema::hasColumn('products', 'category_ids')) {
                $table->json('category_ids')->nullable()->after('description');
            }
            if (!Schema::hasColumn('products', 'is_weightless')) {
                $table->boolean('is_weightless')->default(false)->after('weight');
            }
        });

        Schema::table('orders', function (Blueprint $table) {
            if (!Schema::hasColumn('orders', 'order_code')) {
                $table->string('order_code', 200)->nullable()->after('customer_id');
            }
            if (!Schema::hasColumn('orders', 'order_status')) {
                $table->string('order_status', 50)->default('Ordered')->after('status');
            }
            if (!Schema::hasColumn('orders', 'razorpay_payment_id')) {
                $table->string('razorpay_payment_id', 200)->nullable()->after('order_status');
            }
        });

        Schema::table('customers', function (Blueprint $table) {
            if (!Schema::hasColumn('customers', 'door_no')) {
                $table->string('door_no')->nullable()->after('mandal');
            }
        });
    }

    public function down(): void
    {
        // No destructive reverse
    }
};

