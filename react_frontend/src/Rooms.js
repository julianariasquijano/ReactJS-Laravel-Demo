
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
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteIcon from '@material-ui/icons/Delete';
import DetailIcon from '@material-ui/icons/RadioButtonChecked';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';

import Bookings from './Bookings'
import Config from './Config'



let actualData={}
let lastRowIdUpdated=0
let validationMessages={}
let imageData=''

class Rooms extends Component {

    constructor(props){
        super()
        this.state = {
            connectionError:false,
            loadingData:true,
            rows:[],
            detailsOpened:false,
            validationMessages:{},
            roomTypes:[],
            selectedRoomType:0,
            hotel:props.hotel,
            returnFunction:props.returnFunction,
            selectedRoom:0,
            deleteConfirmationOpened:false,
            selectedRowForDeletion:{}
        }

    }

    componentWillMount() {
        fetch(Config.api + '/rooms_by_hotel/'+this.state.hotel.id)
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
    openDetails = () => {
        imageData = ''
        actualData= {id:0,room_type_id:0,hotel_id:this.state.hotel.id}
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
    deleteRowRemote = () => {
        let url = Config.api + '/room/'+ this.state.selectedRowForDeletion.id
        this.setState({loadingData:true})
        fetch(url, {method: 'DELETE'})
            .then(response => response.json())
            .then(jsonObject => {
                this.setState({loadingData:false})
            })        
            .then(response => this.deleteRow(this.state.selectedRowForDeletion.id))      
    }

    deleteRow = (id) => {
        let newRows = []
        let position = 0
        this.state.rows.forEach(element => {
            if (id.toString() !== element.id.toString()) {
                element.position = position
                newRows.push(element)
                position++
            }
        });

        this.setState({
            deleteConfirmationOpened:false,
            rows:JSON.parse(JSON.stringify(newRows))
        })
    }

    openDeleteConfirmation = (row) => {
        this.setState({
            deleteConfirmationOpened:true,
            selectedRowForDeletion:row,
        })
    }

    closeDeleteConfirmation = () => {
        this.setState({
            deleteConfirmationOpened:false,
        })
    }    
    resetValidationMessages = () => {
        validationMessages = {
            name:'',
            room_type_id:'',
        }
        this.setState({
            validationMessages:validationMessages,
        })
    }
    validateForm = () => {
        let validationResult = true
        this.resetValidationMessages()
        if(actualData.name === undefined || actualData.name === null || actualData.name ===''){
            validationResult = false;
            validationMessages.name='Required'
        }
        if(actualData.room_type_id === 0 || actualData.room_type_id === undefined || actualData.room_type_id === null || actualData.room_type_id ===''){
            validationResult = false;
            validationMessages.room_type_id='Required'
        }
        this.setState({validationMessages : validationMessages}) ;
        return validationResult
    }

    saveRowRemote = () => {
        if(!this.validateForm())return

        let method='POST'
        let url = Config.api + '/room'
        if(actualData.id !==0){
            method = 'PUT'
            url += '/'+ actualData.id
        } 

        this.setState({loadingData:true})

        let tempActualData = JSON.parse(JSON.stringify(actualData))
        tempActualData.image = '' //Because the image really will go in the body and not as query parameter

        url += '?' + Object.keys(tempActualData)
          .map(key => `${key}=${tempActualData[key].toString()}`)
          .join('&');

        fetch(url, {method: method,body:imageData})
            .then(response => response.json())
            .then(jsonObject => {
            //lastRowIdUpdated is used to correctly edit a recently created row
            lastRowIdUpdated=jsonObject.data.id
            this.setState({loadingData:false})})        
            .then(response => this.saveRow())      
    }

    saveRow = () => {
        let tempRows = JSON.parse(JSON.stringify(this.state.rows))
        actualData.image = imageData
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

    showBookings = (room) => {
        this.setState({
            selectedRoom:room
        })
    }

    hideBookings = () => {
        this.setState({
            selectedRoom:0
        })
    }
    
    handleCapture = ({ target }) => {
        const fileReader = new FileReader();
        if (target.files[0].size > 427221) {
            alert('Error: Size greater than 430kb')
            return
        }
        fileReader.readAsDataURL(target.files[0]);
        fileReader.onload = (e) => {
            imageData = e.target.result
        }
    }    

    render(){

        if(this.state.selectedRoom !== 0){
            return(<div><Bookings doubleReturnFunction={this.state.returnFunction} returnFunction={this.hideBookings} hotel={this.state.hotel} room={this.state.selectedRoom}></Bookings></div>)
        }                
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
                <span style={{fontSize:'30px',fontWeight:'bold'}}>{this.state.hotel.name} Rooms</span>
                { this.state.loadingData && (
                    <div>
                        <br/>
                        <CircularProgress></CircularProgress>
                    </div>
                )}
                <br/>
                <br/>
                <Breadcrumbs aria-label="breadcrumb">
                    <Typography color="inherit" onClick={this.state.returnFunction} >
                        Hotels
                    </Typography>
                    <Typography color="textPrimary">Rooms</Typography>
                </Breadcrumbs>
                <br></br>
                { !this.state.loadingData && (
                <Paper >
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Room</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rows.map(row => (
                            <TableRow key={row.position}>
                                <TableCell component="th" scope="row">
                                    <img src={row.image} width='100px' height='100px' /> 
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {this.getRoomTypeLabel(row.room_type_id)}
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
                                    &nbsp;&nbsp;
                                    <Fab id={row.id}
                                        size='small'
                                        variant="round" 
                                        color='primary' 
                                        onClick={() => {this.showBookings(row)}} 
                                    >
                                        <DetailIcon/> 
                                    </Fab>
                                    &nbsp;&nbsp;
                                    <Fab id={row.id}
                                        size='small'
                                        variant="round" 
                                        color='secondary' 
                                        onClick={() => {this.openDeleteConfirmation(row)}} 
                                    >
                                        <DeleteIcon/>
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
                        <h3>Room Details</h3>
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
                            <TextField inputProps={{name:'name'}}  label="Room" variant="outlined" defaultValue={actualData.name} onChange={this.updateInputValue} />
                        </div>
                        <br/>
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
                        <br/>
                        <Button
                            variant="contained"
                            component="label"
                            >
                            Upload JPG Image
                            <input
                                id="image"
                                type="file"
                                accept="image/jpeg"
                                style={{ display: "none" }}
                                onChange={this.handleCapture}
                            />
                        </Button>

                    </DialogContent>
                </Dialog>  
                <Dialog open={this.state.deleteConfirmationOpened} onClose={this.closeDeleteConfirmation}  >
                    <DialogContent>
                            <h2>Delete Room <span style={{color:'coral'}}>{this.state.selectedRowForDeletion.name}</span> and dependent information ?</h2>
                    </DialogContent>
                    <DialogActions>
                    <span className='controlWraperStyle'  >
                            <Button variant="contained" color="primary" onClick={this.deleteRowRemote}>
                                DELETE
                            </Button>
                        </span>
                        <span className='controlWraperStyle' >
                            <Button variant="contained" color="secondary" onClick={this.closeDeleteConfirmation} >
                                Cancel
                            </Button>
                        </span>   
                    </DialogActions>                    
                </Dialog>                                
            </div>
        );
    }
}

export default Rooms;