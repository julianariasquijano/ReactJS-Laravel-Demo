<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
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

        $validator=Validator::make($request->input(), [
            'price' => 'required|integer',
            'hotel_id' => 'required|integer',
            'room_type_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }

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

        $validator=Validator::make(['id'=>$id],[
            'id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }  

         $record = Price::find($id); //id comes from route
        if( $record ){
            return new PriceResource($record);
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
        $validator=Validator::make(array_add($request->input(),'id',$id), [
            'id' => 'required|integer',
            'price' => 'required|integer',
            'hotel_id' => 'required|integer',
            'room_type_id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }

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

        $validator=Validator::make(['id'=>$id],[
            'id' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }  

        $record = Price::findOrfail($id);
        if($record->delete()){
            return  new PriceResource($record);
        }
        return "Error while deleting";
    }

}

