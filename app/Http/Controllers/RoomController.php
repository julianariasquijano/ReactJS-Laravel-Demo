<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
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
     * Display a listing of the resource filtered by hotel.
     *
     * @return \Illuminate\Http\Response
     */

    public function indexByHotel($id)
    {
        ini_set('display_errors', '1');error_reporting(E_ALL);
        $record = Room::whereHotel_id($id)->get();
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
        $validator=Validator::make($request->input(), [
            'name' => 'required|min:2',
            'hotel_id' => 'required|integer',
            'room_type_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        } 

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

        $validator=Validator::make(['id'=>$id],[
            'id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }  

         $record = Room::find($id); //id comes from route
        if( $record ){
            return new RoomResource($record);
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

        $validator=Validator::make(array_add($request->input(),'id',$id), [
            'id' => 'required|integer',
            'name' => 'required|min:2',
            'hotel_id' => 'required|integer',
            'room_type_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }

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

        $validator=Validator::make(['id'=>$id],[
            'id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }  

        $record = Room::findOrfail($id);
        if($record->delete()){
            return  new RoomResource($record);
        }
        return "Error while deleting";
    }

}

