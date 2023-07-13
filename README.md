[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
# ReactJS-Laravel-Demo

Proof of concept using ReactJS with Material UI, Laravel and DevExpress components for React (Calendar control)

<b>DISCLAIMER:</b> This demo is free software but the DevExpress components are NOT free software. The use of DevExpress components requires a paid license which can be obtained in https://js.devexpress.com/Overview/React/

## Run de project

- PHP Laravel Framework API REST Backend:
```
         composer install
         (set DB credentials in .env file)
         artisan migrate
         artisan db:seed  (this command is optional)
         artisan serve   (should run in port 8000)
```
- Javascript (NodeJs) React JS library Frontend:
```
        cd react_frontend
        npm install
        npm start
```

## Screenshots

<table>
 <tr>
  <th>Add a new Hotel</th>
  <th>Hotels list</th>
 </tr> 
 <tr>
  <td><img src="https://raw.githubusercontent.com/julianariasquijano/ReactJS-Laravel-Demo/master/screenshots/add_hotel.png"></td>
  <td><img src="https://raw.githubusercontent.com/julianariasquijano/ReactJS-Laravel-Demo/master/screenshots/hotels_list.png"></td>
 </tr>
</table>

<table>
 <tr>
  <th>Room types list</th>
  <th>Add Price</th>
  <th>Prices list</th>
 </tr> 
 <tr>
  <td><img src="https://raw.githubusercontent.com/julianariasquijano/ReactJS-Laravel-Demo/master/screenshots/room_types_list.png"></td>
  <td><img src="https://raw.githubusercontent.com/julianariasquijano/ReactJS-Laravel-Demo/master/screenshots/add_price.png"></td>
  <td><img src="https://raw.githubusercontent.com/julianariasquijano/ReactJS-Laravel-Demo/master/screenshots/prices_list.png"></td>   
 </tr>
</table>

<table>
 <tr>
  <th>Rooms list</th>
  <th>New booking</th>
 </tr> 
 <tr>
  <td><img src="https://raw.githubusercontent.com/julianariasquijano/ReactJS-Laravel-Demo/master/screenshots/rooms_list.png"></td>
  <td><img src="https://raw.githubusercontent.com/julianariasquijano/ReactJS-Laravel-Demo/master/screenshots/new_booking.png"></td>  
 </tr>
</table>

<table>
 <tr>
  <th>Selecting booking date</th>
  <th>Bookings by room</th>
  <th>Bookings calendar view</th>
 </tr> 
 <tr>
  <td><img src="https://raw.githubusercontent.com/julianariasquijano/ReactJS-Laravel-Demo/master/screenshots/selecting_date.png"></td>
  <td><img src="https://raw.githubusercontent.com/julianariasquijano/ReactJS-Laravel-Demo/master/screenshots/bookings_by_room.png"></td>
  <td><img src="https://raw.githubusercontent.com/julianariasquijano/ReactJS-Laravel-Demo/master/screenshots/bookings_calendar_view.png"></td>   
 </tr>
</table>
