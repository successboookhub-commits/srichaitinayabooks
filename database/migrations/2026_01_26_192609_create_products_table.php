<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // Foreign key to categories table
            $table->foreignId('category_id')->constrained()->onDelete('cascade');

            // Product fields
            $table->string('name');
            $table->decimal('old_price', 10, 2);
            $table->decimal('discount', 5, 2)->nullable();
            $table->decimal('total_price', 10, 2);
            $table->integer('quantity')->default(1);
            $table->decimal('weight', 8, 2)->default(0.1);
            $table->decimal('shipping_charge', 10, 2)->default(0);

            // Photos
            $table->string('main_photo');
            $table->json('related_photos')->nullable();

            // Description
            $table->text('description')->nullable();

            // Toggle fields
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('products');
    }
};
