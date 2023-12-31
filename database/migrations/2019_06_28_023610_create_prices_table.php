<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePricesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prices', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->bigInteger('hotel_id')->unsigned();
            $table->foreign('hotel_id')->references('id')
            ->on('hotels')
            ->onDelete('cascade');

            $table->bigInteger('room_type_id')->unsigned();
            $table->foreign('room_type_id')->references('id')
            ->on('room_types')
            ->onDelete('cascade');
                
            $table->integer('price');
            $table->unique(['hotel_id','room_type_id']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('prices');
    }
}
