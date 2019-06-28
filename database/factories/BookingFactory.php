<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Booking;
use App\Room;
use Faker\Generator as Faker;

$factory->define(Booking::class, function (Faker $faker) {

    $roomIds = Room::all()->pluck('id')->toArray();
    return [
        'room_id' => $faker->randomElement($roomIds),
        'date_start' => $faker->date,
        'date_end' => $faker->date,
        'customer_name' => $faker->name,
        'customer_email' => $faker->email,
        'total_nights' => $faker->numberBetween(3,7)
    ];
});
