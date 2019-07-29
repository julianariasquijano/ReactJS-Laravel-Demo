
import React,{Component} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';

import Config from './Config'


let actualData={}
let lastRowIdUpdated=0
let validationMessages={}

class PricesList extends Component {

    constructor(props){
        super()
        this.state = {
            connectionError:false,
            loadingData:true,
            rows:[],
            detailsOpened:false,
            validationMessages:{},
            roomTypes:[],
            hotels:[],
            selectedRoomType:0,
            selectedHotel:0,
        }

    }

    componentWillMount() {
        fetch(Config.api + '/prices')
          .then(response => response.json())
          .then(jsonObject => {
            //Asigning each element the position in array, in order to facilitate the automatic edition  
            let rows = jsonObject.data
            let tempRows = []
            let elementCounter = 0;
            rows.forEach(element => {
                element.position = elementCounter
                tempRows.push(element)
                elementCounter++
            });
            this.setState({rows:tempRows,loadingData:false})
          })
          .catch(ex => this.setState({connectionError:true,loadingData:false}));

        fetch(Config.api + '/room_types')
          .then(response => response.json())
          .then(jsonObject => {
            this.setState({roomTypes:jsonObject.data,loadingData:false})
          })
          .catch(ex => this.setState({connectionError:true,loadingData:false}));
        fetch(Config.api + '/hotels')
          .then(response => response.json())
          .then(jsonObject => {
            this.setState({hotels:jsonObject.data,loadingData:false})
          })
          .catch(ex => this.setState({connectionError:true,loadingData:false}));
      }    

    updateInputValue = function (event) {
        event.persist()
        actualData[event.target.name]= event.target.value
    }
    updateRoomTypeValue = (event) => {
        this.updateInputValue(event)
        this.setState({
            selectedRoomType:event.target.value,
        })
      }    
    updateHotelValue = (event) => {
        this.updateInputValue(event)
        this.setState({
            selectedHotel:event.target.value,
        })
      }    
    openDetails = () => {
        actualData= {id:0,room_type_id:0,hotel_id:0}
        this.setState({
            detailsOpened:true,
        })
    }

    openDetailsWithRow = (row) => {
        actualData = JSON.parse(JSON.stringify(row))
        this.setState({
            detailsOpened:true,
        })
    }
    closeDetails = () => {
        this.resetValidationMessages()
        this.setState({
            detailsOpened:false,
        })
    }
    resetValidationMessages = () => {
        validationMessages = {
            hotel_id:'',
            room_type_id:'',
            price:'',
        }
        this.setState({
            validationMessages:validationMessages,
        })
    }
    validateForm = () => {
        let validationResult = true
        this.resetValidationMessages()
        if( actualData.price === '0' || actualData.price === undefined || actualData.price === null || actualData.price ===''){
            validationResult = false;
            validationMessages.name='Required and greater than 0'
        }
        else if( ! /^\d+$/.test(actualData.price) ){
            validationResult = false;
            validationMessages.name='Only digits are allowed'
        }
        if(actualData.room_type_id === 0 || actualData.room_type_id === undefined || actualData.room_type_id === null || actualData.room_type_id ===''){
            validationResult = false;
            validationMessages.room_type_id='Required'
        }
        if(actualData.hotel_id === 0 || actualData.hotel_id === undefined || actualData.hotel_id === null || actualData.hotel_id ===''){
            validationResult = false;
            validationMessages.hotel_id='Required'
        }
        this.setState({validationMessages : validationMessages}) ;
        return validationResult
    }

    saveRowRemote = () => {
        if(!this.validateForm())return

        let method='POST'
        let url = Config.api + '/price'
        if(actualData.id !==0){
            method = 'PUT'
            url += '/'+ actualData.id
        } 

        this.setState({loadingData:true})

        url += '?' + Object.keys(actualData)
          .map(key => `${key}=${actualData[key].toString()}`)
          .join('&');

        fetch(url, {method: method})
            .then(response => response.json())
            .then(jsonObject => {
            //lastRowIdUpdated is used to correctly edit a recently created row
            lastRowIdUpdated=jsonObject.data.id
            this.setState({loadingData:false})})        
            .then(response => this.saveRow())      
    }

    saveRow = () => {
        let tempRows = JSON.parse(JSON.stringify(this.state.rows))
        if(actualData.id ===0){
            actualData.position = this.state.rows.length
            actualData.id = lastRowIdUpdated
            tempRows.push(actualData)
        }
        else {
            tempRows[actualData.position] = JSON.parse(JSON.stringify(actualData))
        }

        this.setState({
            detailsOpened:false,
            rows:JSON.parse(JSON.stringify(tempRows))
        })
        this.closeDetails()
    }

    getRoomTypeLabel = (room_type_id) => {

        let roomTypeLabel = ''
        this.state.roomTypes.forEach(roomType => {
            if(roomType.id.toString() === room_type_id.toString()){
                roomTypeLabel = roomType.type
            }
        })
        return roomTypeLabel

    }
    getHotelLabel = (hotel_id) => {

        let hotelLabel = ''
        this.state.hotels.forEach(hotel => {
            if(hotel.id.toString() === hotel_id.toString()){
                hotelLabel = hotel.name
            }
        })
        return hotelLabel

    }


    render(){

        return (
            <div>
                { !this.state.connectionError && (
                  <Fab 
                  variant="round" 
                  color='primary' 
                  onClick={this.openDetails} 
                  >
                    <AddIcon />
                </Fab>
                )}
                &nbsp;&nbsp;&nbsp;
                <span style={{fontSize:'30px',fontWeight:'bold'}}>Prices</span>
                { this.state.loadingData && (
                    <div>
                        <br/>
                        <CircularProgress></CircularProgress>
                    </div>
                )}
                <br/>
                <br/>
                { !this.state.loadingData && (
                <Paper >
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>Hotel</TableCell>
                                <TableCell>Room Type</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rows.map(row => (
                            <TableRow key={row.position}>
                                <TableCell component="th" scope="row">
                                    {this.getHotelLabel(row.hotel_id)}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {this.getRoomTypeLabel(row.room_type_id)}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    USD ${row.price.toLocaleString()}
                                </TableCell>
                                <TableCell >
                                    <Fab id={row.id}
                                        size='small'
                                        variant="round" 
                                        color='primary' 
                                        onClick={() => {this.openDetailsWithRow(row)}} 
                                    >
                                        <EditIcon/>
                                    </Fab>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
                )}
                { this.state.connectionError && (
                    <div>
                        <Snackbar
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                            }}
                            open={true}
                            autoHideDuration={6000}
                        >
                        <SnackbarContent
                            style={{backgroundColor:'darkred'}}
                            message={
                                <span>
                                Connection Error
                                </span>
                            }

                        />
                        </Snackbar>
                    </div>
                )}
                <Dialog open={this.state.detailsOpened} onClose={this.closeDetails}  >
                    <DialogContent>
                        <h3>Price Details</h3>
                        <span className='controlWraperStyle'  >
                            <Button variant="contained" color="primary" onClick={this.saveRowRemote}>
                                Save
                            </Button>
                        </span>
                        <span className='controlWraperStyle' >
                            <Button variant="contained" color="secondary" onClick={this.closeDetails} >
                                Cancel
                            </Button>
                        </span>                  
                        <br/>

                        <div className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.name}</div>
                            <TextField inputProps={{name:'price'}}  label="USD Price" variant="outlined" defaultValue={actualData.price} onChange={this.updateInputValue} />
                        </div>
                        <br/>
                        <div className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.hotel_id}</div>
                            <FormControl >
                                <InputLabel  htmlFor="hotel">
                                    <label>Hotel</label>
                                </InputLabel>          
                                <Select value={0} input={<Input id="hotel" name='hotel_id'  />} onChange={this.updateHotelValue} value={actualData.hotel_id} >
                                    <MenuItem value={0} key={0} ><em>Select <b>type ...</b></em></MenuItem>
                                    {this.state.hotels.map(hotel => (
                                        <MenuItem key={hotel.id} value={hotel.id} >{hotel.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.room_type_id}</div>
                            <FormControl >
                                <InputLabel  htmlFor="room_type">
                                    <label>Room&nbsp;Type</label>
                                </InputLabel>          
                                <Select value={0} input={<Input id="room_type" name='room_type_id'  />} onChange={this.updateRoomTypeValue} value={actualData.room_type_id} >
                                    <MenuItem value={0} key={0} ><em>Select <b>type ...</b></em></MenuItem>
                                    {this.state.roomTypes.map(roomType => (
                                        <MenuItem key={roomType.id} value={roomType.id} >{roomType.type}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </DialogContent>
                </Dialog>          
            </div>
        );
    }
}

export default PricesList;