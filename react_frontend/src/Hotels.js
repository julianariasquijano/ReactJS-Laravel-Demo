
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
import DialogActions from '@material-ui/core/DialogActions';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DetailIcon from '@material-ui/icons/RadioButtonChecked';
import TextField from '@material-ui/core/TextField';

import Rooms from './Rooms'
import Config from './Config'

let actualData={}
let lastRowIdUpdated=0
let validationMessages={}

class Hotels extends Component {

    constructor(props){
        super()
        this.state = {
            connectionError:false,
            loadingData:true,
            rows:[],
            detailsOpened:false,
            validationMessages:{},
            selectedHotel:0,
            deleteConfirmationOpened:false,
            selectedRowForDeletion:{}

        }

    }

    componentWillMount() {
        fetch(Config.api + '/hotels')
          .then(response => response.json())
          .then(jsonObject => {
            //Asigning each element the position in array, in order to facilitate the automatic edition  
            let rows = jsonObject.data
            let tempRows = []
            let elementCounter = 0;
            rows.forEach(element => {
                element.position = elementCounter
                element.image=''
                tempRows.push(element)
                elementCounter++
            });
            this.setState({rows:tempRows,loadingData:false})
          })
          .catch(ex => this.setState({connectionError:true,loadingData:false}));
      }    

    updateInputValue = function (event) {
        event.persist()
        actualData[event.target.name]= event.target.value
    }

    openDetails = () => {
        actualData= {id:0}
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
        let url = Config.api + '/hotel/'+ this.state.selectedRowForDeletion.id
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
            address:'',
            city:'',
            state:'',
            country:'',
            zip_code:'',
            phone:'',
            email:'',
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
        if(actualData.address === undefined || actualData.address === null || actualData.address ===''){
            validationResult = false;
            validationMessages.address='Required'
        }
        if(actualData.city === undefined || actualData.city === null || actualData.city ===''){
            validationResult = false;
            validationMessages.city='Required'
        }
        if(actualData.state === undefined || actualData.state === null || actualData.state ===''){
            validationResult = false;
            validationMessages.state='Required'
        }
        if(actualData.country === undefined || actualData.country === null || actualData.country ===''){
            validationResult = false;
            validationMessages.country='Required'
        }
        if(actualData.zip_code === undefined || actualData.zip_code === null || actualData.zip_code ===''){
            validationResult = false;
            validationMessages.zip_code='Required'
        }
        if(actualData.phone === undefined || actualData.phone === null || actualData.phone ===''){
            validationResult = false;
            validationMessages.phone='Required'
        }
        if(actualData.email === undefined || actualData.email === null || actualData.email ===''){
            validationResult = false;
            validationMessages.email='Required'
        }
        else if( ! /\S+@\S+\.\S+/.test(actualData.email) ){
            validationResult = false;
            validationMessages.email='Invalid E-Mail'
        }        
        this.setState({validationMessages : validationMessages}) ;
        return validationResult
    }

    saveRowRemote = () => {
        if(!this.validateForm())return

        let method='POST'
        let url = Config.api + '/hotel'
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

    showRooms = (hotel) => {
        this.setState({
            selectedHotel:hotel
        })
    }

    hideRooms = () => {
        this.setState({
            selectedHotel:0
        })
    }


    render(){
        if(this.state.selectedHotel !== 0){
            return(<div><Rooms returnFunction={this.hideRooms} hotel={this.state.selectedHotel}></Rooms></div>)
        }
        else return (
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
                <span style={{fontSize:'30px',fontWeight:'bold'}}>Hotels</span>
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
                                <TableCell>Name</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rows.map(row => (
                            <TableRow key={row.position}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell >{row.phone}</TableCell>
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
                                        onClick={() => {this.showRooms(row)}} 
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
                        <h3>Hotel Details</h3>
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

                        <span className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.name}</div>
                            <TextField inputProps={{name:'name'}}  label="Name" variant="outlined" defaultValue={actualData.name} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.address}</div>
                            <TextField inputProps={{name:'address'}} label="Address" variant="outlined" defaultValue={actualData.address} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.city}</div>
                            <TextField inputProps={{name:'city'}} label="City" variant="outlined" defaultValue={actualData.city} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.state}</div>
                            <TextField inputProps={{name:'state'}} label="State" variant="outlined" defaultValue={actualData.state} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.country}</div>
                            <TextField inputProps={{name:'country'}} label="Country" variant="outlined" defaultValue={actualData.country} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                        <div className='errorMessages' >{this.state.validationMessages.zip_code}</div>
                            <TextField inputProps={{name:'zip_code'}} label="Zip Code" variant="outlined" defaultValue={actualData.zip_code} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.phone}</div>
                            <TextField inputProps={{name:'phone'}} label="Phone" variant="outlined" defaultValue={actualData.phone} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.email}</div>
                            <TextField inputProps={{name:'email'}} label="E-Mail" variant="outlined" defaultValue={actualData.email} onChange={this.updateInputValue} />
                        </span>

                    </DialogContent>
                </Dialog>   
                <Dialog open={this.state.deleteConfirmationOpened} onClose={this.closeDeleteConfirmation}  >
                    <DialogContent>
                            <h2>Delete the Hotel <span style={{color:'coral'}}>{this.state.selectedRowForDeletion.name}</span> and dependent information ?</h2>
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

export default Hotels;