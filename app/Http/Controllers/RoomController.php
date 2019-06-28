<?php

namespace App\Http\Controllers;
use App\Http\Requests;
use Illuminate\Http\Request;

use App\Http\Resources\RoomResource;
use App\Room;



class RoomController extends Controller

{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {
        $record = Room::all();
        return RoomResource::collection($record);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(Request $request)

    {
        $record = new Room;

        $record->hotel_id = $request->input('hotel_id');
        $record->room_type_id = $request->input('room_type_id');
        $record->name = $request->input('name');
        $record->image = $request->input('image');

        $record->save();

        return new RoomResource($record);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function show($id)

    {
         $article = Room::find($id); //id comes from route
        if( $article ){
            return new RoomResource($article);
        }
        return "Room Not found"; // temporary error

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function update(Request $request, $id)
    {
        $record = Room::find($id);

        $record->hotel_id = $request->input('hotel_id');
        $record->room_type_id = $request->input('room_type_id');
        $record->name = $request->input('name');
        $record->image = $request->input('image');

        $record->save();

        return new RoomResource($record);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function destroy($id)
    {
        $record = Room::findOrfail($id);
        if($record->delete()){
            return  new RoomResource($record);
        }
        return "Error while deleting";
    }

}

