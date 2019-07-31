<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Http\Resources\BookingResource;
use App\Booking;



class BookingController extends Controller

{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {
        $record = Booking::all();
        return BookingResource::collection($record);
    }

     /**
     * Display a listing of the resource filtered by room.
     *
     * @return \Illuminate\Http\Response
     */

    public function indexByRoom($id)
    {
        $record = Booking::whereRoom_id($id)->get();
        return BookingResource::collection($record);
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
            'room_id' => 'required|integer',
            'date_start' => 'required',
            'date_end' => 'required',
            'customer_name' => 'required|min:2',
            'customer_email' => 'required',
            'total_nights' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }


        $record = new Booking;

        $record->room_id = $request->input('room_id');
        $record->date_start = $request->input('date_start');
        $record->date_end = $request->input('date_end');
        $record->customer_name = $request->input('customer_name');
        $record->customer_email = $request->input('customer_email');
        $record->total_nights = $request->input('total_nights');
        //$record->user_id = $request->input('user_id');

        $record->save();

        return new BookingResource($record);

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

         $record = Booking::find($id); //id comes from route
        if( $record ){
            return new BookingResource($record);
        }
        return "Booking Not found"; // temporary error

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
            'room_id' => 'required|integer',
            'date_start' => 'required',
            'date_end' => 'required',
            'customer_name' => 'required|min:2',
            'customer_email' => 'required',
            'total_nights' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }

        $record = Booking::find($id);
        
        $record->room_id = $request->input('room_id');
        $record->date_start = $request->input('date_start');
        $record->date_end = $request->input('date_end');
        $record->customer_name = $request->input('customer_name');
        $record->customer_email = $request->input('customer_email');
        $record->total_nights = $request->input('total_nights');
        //$record->user_id = $request->input('user_id');

        $record->save();

        return new BookingResource($record);

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

        $record = Booking::findOrfail($id);
        if($record->delete()){
            return  new BookingResource($record);
        }
        return "Error while deleting";
    }

}

