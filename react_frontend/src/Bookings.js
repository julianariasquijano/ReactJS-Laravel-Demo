
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

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import CalendarIcon from '@material-ui/icons/CalendarToday';

import TextField from '@material-ui/core/TextField';

import {
    DatePicker,
    MuiPickersUtilsProvider,
  } from "@material-ui/pickers";

import MomentUtils from '@date-io/moment';


import { ViewState } from '@devexpress/dx-react-scheduler';
import { Scheduler, MonthView,WeekView, Appointments,Toolbar,DateNavigator,TodayButton } from '@devexpress/dx-react-scheduler-material-ui';

import Config from './Config'



let actualData={}
let lastRowIdUpdated=0
let validationMessages={}

class Bookings extends Component {

    constructor(props){
        super()
        this.state = {
            connectionError:false,
            loadingData:true,
            rows:[],
            detailsOpened:false,
            validationMessages:{},
            room:props.room,
            returnFunction:props.returnFunction,
            doubleReturnFunction:props.doubleReturnFunction,
            dateStart:null,
            dateEnd:null,
            total_nights:0,
            schedulerData:[],
            schedulerView:false,

        }

    }

    componentWillMount() {
        fetch(Config.api + '/bookings_by_room/'+this.state.room.id)
          .then(response => response.json())
          .then(jsonObject => {
            let tempBookings = []
            //Asigning each element the position in array, in order to facilitate the automatic edition  
            let rows = jsonObject.data
            let tempRows = []
            let elementCounter = 0;
            rows.forEach(element => {
                tempBookings.push({startDate:element.date_start,endDate:element.date_end,title:element.customer_name})
                element.position = elementCounter
                element.image=''
                tempRows.push(element)
                elementCounter++
            });
            this.setState({rows:tempRows,schedulerData:tempBookings,loadingData:false})
          })
          .catch(ex => this.setState({connectionError:true,loadingData:false}));

      }    

    updateSchedulerEvents = () => {
        let tempBookings = []
        this.state.rows.forEach(element => {
            tempBookings.push({startDate:element.date_start,endDate:element.date_end,title:element.customer_name})
            this.setState({schedulerData:tempBookings})
        });

    }

    updateInputValue = function (event) {
        event.persist()
        actualData[event.target.name]= event.target.value
    }
    updateDateStartValue = (event) => {
        actualData.date_start= event.toISOString().substr(0,10)
        this.setState({dateStart:actualData.date_start})
        this.setTotalNights()

    }
    updateDateEndValue = (event) => {
        actualData.date_end= event.toISOString().substr(0,10)
        this.setState({dateEnd:actualData.date_end})
        this.setTotalNights()
    }
  
    setTotalNights = () => {
        actualData.total_nights = Math.floor((new Date(actualData.date_start)-new Date(actualData.date_end))/1000/86400) * -1
        this.setState({
             total_nights: actualData.total_nights
        })
    }
    openDetails = () => {
        let todayDate = new Date()
        let todayDateText = todayDate.toISOString().substr(0,10)
        actualData= {id:0,room_id:this.state.room.id,date_start:todayDateText,date_end:todayDateText,customer_name:'',customer_email:'',total_nights:0}
        this.setState({
            detailsOpened:true,
            dateStart:actualData.date_start,
            dateEnd:actualData.date_end,
            total_nights:0
        })
    }

    openDetailsWithRow = (row) => {
        actualData = JSON.parse(JSON.stringify(row))
        this.setState({
            dateStart:actualData.date_start,
            dateEnd:actualData.date_end,
            detailsOpened:true,
        })
        this.setTotalNights()
    }
    closeDetails = () => {
        this.resetValidationMessages()
        this.setState({
            detailsOpened:false,
        })
    }
    resetValidationMessages = () => {
        validationMessages = {
            name:'',
            date_start:'',
            date_end:'',
            customer_name:'',
            customer_email:'',
        }
        this.setState({
            validationMessages:validationMessages,
        })
    }
    validateForm = () => {
        let validationResult = true
        this.resetValidationMessages()

        if( actualData.date_start === undefined || actualData.date_start === null || actualData.date_start ===''){
            validationResult = false;
            validationMessages.date_start='Required'
        }
        if( actualData.date_end === undefined || actualData.date_end === null || actualData.date_end ===''){
            validationResult = false;
            validationMessages.date_end='Required'
        }
        if( actualData.customer_name === undefined || actualData.customer_name === null || actualData.customer_name ===''){
            validationResult = false;
            validationMessages.customer_name='Required'
        }
        if( actualData.customer_email === undefined || actualData.customer_email === null || actualData.customer_email ===''){
            validationResult = false;
            validationMessages.customer_email='Required'
        }
        else if( ! /\S+@\S+\.\S+/.test(actualData.customer_email) ){
            validationResult = false;
            validationMessages.customer_email='Invalid E-Mail'
        }
        if( actualData.total_nights <= 0 ){
            validationResult = false;
            validationMessages.date_start='Date Start greater than Date End'
        }
            
        this.setState({validationMessages : validationMessages}) ;
        return validationResult
    }

    validateAvailability = () => {
        let validationResult = true
        this.resetValidationMessages()

        this.state.rows.forEach(row => {
            if(actualData.id === row.id)return
            let actualDateStart = new Date (actualData.date_start)
            let actualDateEnd = new Date (actualData.date_end)
            let rowDateStart = new Date (row.date_start)
            let rowDateEnd = new Date (row.date_end)

            if( actualDateStart >= rowDateStart  && actualDateStart <= rowDateEnd ){
                validationResult = false;
                validationMessages.date_start='Date Start not available'
                return
            }
            else if( actualDateEnd >= rowDateStart  && actualDateEnd <= rowDateEnd ){
                validationResult = false;
                validationMessages.date_end='Date End not available'
                return
            }
            else if( actualDateStart <= rowDateStart  && actualDateEnd >= rowDateEnd ){
                validationResult = false;
                validationMessages.date_start='Date Overflow'
                return
            }
        });

        this.setState({validationMessages : validationMessages}) ;
        return validationResult
    }

    saveRowRemote = () => {
        if(!this.validateForm())return
        if(!this.validateAvailability())return

        let method='POST'
        let url = Config.api + '/booking'
        if(actualData.id !==0){
            method = 'PUT'
            url += '/'+ actualData.id
        } 

        actualData.date_start = actualData.date_start.toString().split('/').join('-')
        actualData.date_end = actualData.date_end.toString().split('/').join('-')

        this.setState({loadingData:true})

        delete actualData.user_id//null value prevents the maping
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
        this.updateSchedulerEvents()
        this.closeDetails()
    }
    
    closeScheduler = () => {
        this.setState({schedulerView:false})
    }

    render(){

        return (
            <div>
                { !this.state.connectionError && (
                <span>
                <Fab 
                    variant="round" 
                    color='primary' 
                    onClick={() => {this.setState({schedulerView:true})}} 
                >
                    <CalendarIcon/>
                </Fab>                    
                &nbsp;
                <Fab 
                  variant="round" 
                  color='primary' 
                  onClick={this.openDetails} 
                  >
                    <AddIcon />
                </Fab>
                </span>
                )}
                &nbsp;&nbsp;&nbsp;
                <span style={{fontSize:'30px',fontWeight:'bold'}}>{this.state.room.name} Bookings</span>
                { this.state.loadingData && (
                    <div>
                        <br/>
                        <CircularProgress></CircularProgress>
                    </div>
                )}
                <br/>
                <br/>
                <Breadcrumbs aria-label="breadcrumb">
                    <Typography color="inherit" onClick={this.state.doubleReturnFunction} >
                        Hotels
                    </Typography>
                    <Typography color="inherit" onClick={this.state.returnFunction} >
                        Rooms
                    </Typography>
                    <Typography color="textPrimary">Bookings</Typography>
                </Breadcrumbs>
                <br></br>
                { !this.state.loadingData && (
                <Paper >                 
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Nights</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rows.map(row => (
                            <TableRow key={row.position}>
                                <TableCell component="th" scope="row">
                                    {row.date_start}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.date_end}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.customer_name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.total_nights}
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
                        <h3>Booking Details</h3>
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
                        <span color="inherit" style={{fontWeight:'bold',fontSize:'25px'}}>
                            Total Nights: {this.state.total_nights}
                        </span>                                          
                        <br/>
                        <MuiPickersUtilsProvider utils={MomentUtils}>
                          <span className='controlWraperStyle' >
                            <div className='errorMessages' >{this.state.validationMessages.date_start}</div>
                            <DatePicker format="YYYY/MM/DD" name='date_start' minDate={new Date()} label='Date Start' inputVariant="outlined" value={this.state.dateStart} onChange={this.updateDateStartValue}  /> 
                          </span>                 
                          <span className='controlWraperStyle' >
                            <div className='errorMessages' >{this.state.validationMessages.date_end}</div>
                            <DatePicker format="YYYY/MM/DD" name='date_end' minDate={new Date()} label='Date End' inputVariant="outlined" value={this.state.dateEnd} onChange={this.updateDateEndValue}  /> 
                          </span>                 
                        </MuiPickersUtilsProvider>                         
                        <div className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.customer_name}</div>
                            <TextField inputProps={{name:'customer_name'}}  label="Customer" variant="outlined" defaultValue={actualData.customer_name} onChange={this.updateInputValue} />
                        </div>
                        <div className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.customer_email}</div>
                            <TextField inputProps={{name:'customer_email'}}  label="E-Mail" variant="outlined" defaultValue={actualData.customer_email} onChange={this.updateInputValue} />
                        </div>

                    </DialogContent>
                </Dialog>
                <Dialog open={this.state.schedulerView} onClose={this.closeScheduler}>
                    <DialogContent>
                        <Button fullWidth color="primary" onClick={this.closeScheduler} >Close</Button>
                        <Scheduler
                            data={this.state.schedulerData}
                        >
                            <ViewState/>                        
                            <MonthView />
                            <Toolbar />
                            <DateNavigator />
                            <TodayButton />                        
                            <Appointments />
                        </Scheduler> 
                    </DialogContent>  
                </Dialog>                          
            </div>
        );
    }
}

export default Bookings;