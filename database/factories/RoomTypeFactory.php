<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\RoomType;
use Faker\Generator as Faker;

$factory->define(RoomType::class, function (Faker $faker) {
    App\RoomType::truncate();
    return [
        'id' => 1,
        'type' => 'Suite'
    ];
});
