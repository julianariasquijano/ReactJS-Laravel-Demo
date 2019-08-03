<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBookingsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->bigInteger('room_id')->unsigned();
            $table->foreign('room_id')->references('id')
            ->on('rooms')
            ->onDelete('cascade');                

            $table->date('date_start');
            $table->date('date_end');
            $table->string('customer_name');
            $table->string('customer_email');
            $table->integer('total_nights');
            
            $table->string('user_id')->nullable();

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
        Schema::dropIfExists('bookings');
    }
}
