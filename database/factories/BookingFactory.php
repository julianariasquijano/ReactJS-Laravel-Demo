<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Booking;
use App\Room;
use Faker\Generator as Faker;

$factory->define(Booking::class, function (Faker $faker) {

    $roomIds = Room::all()->pluck('id')->toArray();
    $dateStart = $faker->dateTimeInInterval($date = '+1 week', $interval = '+3 days', $timezone = null);
    $dateEnd = $faker->dateTimeInInterval($date = '+2 week', $interval = '+3 days', $timezone = null);
    return [
        'room_id' => $faker->randomElement($roomIds),
        'date_start' => $dateStart,
        'date_end' => $dateEnd,
        'customer_name' => $faker->name,
        'customer_email' => $faker->email,
        'total_nights' => $faker->numberBetween(3,7)
    ];
});
