
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

import Config from './Config'



let actualData={}
let lastRowIdUpdated=0
let validationMessages={}

class Rooms extends Component {

    constructor(props){
        super()
        this.state = {
            connectionError:false,
            loadingData:true,
            rows:[],
            detailsOpened:false,
            validationMessages:{}
            //validationMessages:JSON.parse(JSON.stringify(validationMessages))

        }

    }

    componentWillMount() {
        fetch(Config.api + '/rooms')
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
    resetValidationMessages = () => {
        validationMessages = {
            type:'',
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
                <span style={{fontSize:'30px',fontWeight:'bold'}}>Rooms</span>
                { this.state.loadingData && (
                    <div>
                        <br/>
                        <CircularProgress></CircularProgress>
                    </div>
                )}
                <br/>
                <br/>
                <Paper >
                    <Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>Room</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.rows.map(row => (
                            <TableRow key={row.position}>
                                <TableCell component="th" scope="row">
                                    {row.type}
                                </TableCell>
                                <TableCell >
                                    <Fab id={row.id}
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

                        <span className="controlWraperStyle" >
                            <div className='errorMessages' >{this.state.validationMessages.type}</div>
                            <TextField inputProps={{name:'name'}}  label="Room" variant="outlined" defaultValue={actualData.name} onChange={this.updateInputValue} />
                        </span>

                    </DialogContent>
                </Dialog>          
            </div>
        );
    }
}

export default Rooms;