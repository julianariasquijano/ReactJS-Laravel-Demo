<?php

/* @var $factory \Illuminate\Database\Eloquent\Factory */

use App\Hotel;
use Faker\Generator as Faker;

$factory->define(Hotel::class, function (Faker $faker) {

    App\Hotel::truncate();

    return [
        'id' => 1,
        'name' => 'Dan',
        'address' => 'Main Avenue bulevard',
        'city' => 'Denver',
        'state' => 'Colorado',
        'country' => 'US',
        'zip_code' => '1010010',
        'phone' => '2345678900',
        'email' => 'dan@hotels.com',
        'image' => '',
    ];
});
