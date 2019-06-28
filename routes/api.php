<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('hotels', 'HotelController@index');
Route::get('hotel/{id}', 'HotelController@show');
Route::post('hotel', 'HotelController@store');
Route::put('hotel/{id}', 'HotelController@update');
Route::delete('hotel/{id}', 'HotelController@destroy');

Route::get('room_types', 'RoomTypeController@index');
Route::get('room_type/{id}', 'RoomTypeController@show');
Route::post('room_type', 'RoomTypeController@store');
Route::put('room_type/{id}', 'RoomTypeController@update');
Route::delete('room_type/{id}', 'RoomTypeController@destroy');

Route::get('rooms', 'RoomController@index');
Route::get('room/{id}', 'RoomController@show');
Route::post('room', 'RoomController@store');
Route::put('room/{id}', 'RoomController@update');
Route::delete('room/{id}', 'RoomController@destroy');

Route::get('prices', 'PriceController@index');
Route::get('price/{id}', 'PriceController@show');
Route::post('price', 'PriceController@store');
Route::put('price/{id}', 'PriceController@update');
Route::delete('price/{id}', 'PriceController@destroy');

Route::get('bookings', 'BookingController@index');
Route::get('booking/{id}', 'BookingController@show');
Route::post('booking', 'BookingController@store');
Route::put('booking/{id}', 'BookingController@update');
Route::delete('booking/{id}', 'BookingController@destroy');
