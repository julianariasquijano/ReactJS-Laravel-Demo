<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use App\Http\Resources\HotelResource;
use App\Hotel;



class HotelController extends Controller

{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {
        $record = Hotel::all();
        return HotelResource::collection($record);
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
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }   

        $record = new Hotel;

        $record->name = $request->input('name');
        $record->address = $request->input('address');
        $record->city = $request->input('city');
        $record->state = $request->input('state');
        $record->country = $request->input('country');
        $record->zip_code = $request->input('zip_code');
        $record->phone = $request->input('phone');
        $record->email = $request->input('email');

        $record->save();

        return new HotelResource($record);

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

         $record = Hotel::find($id); //id comes from route
        if( $record ){
            return new HotelResource($record);
        }
        return "Hotel Not found"; // temporary error

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
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }

        $record = Hotel::find($id);

        $record->name = $request->input('name');
        $record->address = $request->input('address');
        $record->city = $request->input('city');
        $record->state = $request->input('state');
        $record->country = $request->input('country');
        $record->zip_code = $request->input('zip_code');
        $record->phone = $request->input('phone');
        $record->email = $request->input('email');

        $record->save();

        return new HotelResource($record);

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

        $record = Hotel::findOrfail($id);
        if($record->delete()){
            return  new HotelResource($record);
        }
        return "Error while deleting";
    }

}

