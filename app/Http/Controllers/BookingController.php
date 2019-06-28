<?php

namespace App\Http\Controllers;
use App\Http\Requests;
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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(Request $request)

    {
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
         $article = Booking::find($id); //id comes from route
        if( $article ){
            return new BookingResource($article);
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
        $record = Booking::findOrfail($id);
        if($record->delete()){
            return  new BookingResource($record);
        }
        return "Error while deleting";
    }

}

