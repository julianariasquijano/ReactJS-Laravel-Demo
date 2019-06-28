<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Room;
use Faker\Generator as Faker;

$factory->define(Room::class, function (Faker $faker) {
    return [
        'hotel_id' => 1,
        'room_type_id' => 1,
        'name' => $faker->buildingNumber,
        'image' => ''
    ];
});
