<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = ['hotel_id', 'room_type_id', 'name', 'image'];
}
