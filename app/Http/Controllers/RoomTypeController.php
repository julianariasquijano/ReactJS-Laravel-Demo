<?php

namespace App\Http\Controllers;
use App\Http\Requests;
use Illuminate\Http\Request;

use App\Http\Resources\RoomTypeResource;
use App\RoomType;



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
         $article = RoomType::find($id); //id comes from route
        if( $article ){
            return new RoomTypeResource($article);
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
        $record = RoomType::findOrfail($id);
        if($record->delete()){
            return  new RoomTypeResource($record);
        }
        return "Error while deleting";
    }

}

