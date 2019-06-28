<?php

namespace App\Http\Controllers;
use App\Http\Requests;
use Illuminate\Http\Request;

use App\Http\Resources\PriceResource;
use App\Price;



class PriceController extends Controller

{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {
        $record = Price::all();
        return PriceResource::collection($record);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function store(Request $request)

    {
        $record = new Price;

        $record->hotel_id = $request->input('hotel_id');
        $record->room_type_id = $request->input('room_type_id');
        $record->price = $request->input('price');

        $record->save();

        return new PriceResource($record);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function show($id)

    {
         $article = Price::find($id); //id comes from route
        if( $article ){
            return new PriceResource($article);
        }
        return "Price Not found"; // temporary error

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
        $record = Price::find($id);

        $record->hotel_id = $request->input('hotel_id');
        $record->room_type_id = $request->input('room_type_id');
        $record->price = $request->input('price');

        $record->save();

        return new PriceResource($record);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */

    public function destroy($id)
    {
        $record = Price::findOrfail($id);
        if($record->delete()){
            return  new PriceResource($record);
        }
        return "Error while deleting";
    }

}

