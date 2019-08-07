<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\Http\Resources\RoomTypeResource;
use App\RoomType;

use Illuminate\Support\Facades\Validator;


class RoomTypeController extends Controller

{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function index()
    {
        $record = RoomType::all();
        return RoomTypeResource::collection($record);
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
            'type' => 'required|min:1',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }        

        $record = new RoomType;
        $record->type = $request->input('type');
        $record->save();

        return new RoomTypeResource($record);

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

        $record = RoomType::find($id); //id comes from route
        if( $record ){
            return new RoomTypeResource($record);
        }
        return "RoomType Not found"; // temporary error

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
            'type' => 'required|min:1',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()])->setStatusCode(400);
        }

        $record = RoomType::find($id);
        $record->type = $request->input('type');
        $record->save();

        return new RoomTypeResource($record);

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

        $record = RoomType::findOrfail($id);
        if($record->delete()){
            return  new RoomTypeResource($record);
        }
        return "Error while deleting";
    }

}