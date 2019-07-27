
import React,{Component} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
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

const API = 'http://localhost:8000/api';

let actualData={}
let lastRowIdUpdated=0

class Hotels extends Component {

    constructor(props){
        super()
        this.state = {
            connectionError:false,
            loadingData:true,
            rows:[],
            detailsOpened:false,
        }

    }

    componentWillMount() {
        fetch(API + '/hotels')
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
        this.setState({
            detailsOpened:false,
        })
    }

    saveRowRemote = () => {
        let method='POST'
        let url = API + '/hotel'
        if(actualData.id !==0){
            method = 'PUT'
            url += '/'+ actualData.id
        } 

        this.setState({loadingData:true})

        console.log(actualData)
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

        let classes = makeStyles(theme => ({
            button: {
              margin: theme.spacing(1),
            },
            leftIcon: {
              marginRight: theme.spacing(1),
            },
            rightIcon: {
              marginLeft: theme.spacing(1),
            },
            iconSmall: {
              fontSize: 20,
            },
            progress: {
                margin: theme.spacing(2),
            }, 
            error: {
                backgroundColor:'red',
            },                       
          }));


        return (
            <div>
                <span style={{fontSize:'30px',fontWeight:'bold'}}>HOTELS</span>
                &nbsp;&nbsp;&nbsp;
                { !this.state.connectionError && (
                <Fab 
                    variant="round" 
                    color='primary' 
                    onClick={this.openDetails} 
                >
                    <AddIcon className={clsx(classes.button, classes.iconSmall)} />
                </Fab>
                )}
                { this.state.loadingData && (
                    <div>
                        <br/>
                        <CircularProgress className={classes.progress} ></CircularProgress>
                    </div>
                )}
                <br/>
                <br/>
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
                                        variant="round" 
                                        color='primary' 
                                        onClick={() => {this.openDetailsWithRow(row)}} 
                                    >
                                        <EditIcon className={clsx(classes.button, classes.iconSmall)} />
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
                        <h3>Hotel Details</h3>
                        <span className='controlWraperStyle'  >
                            <Button variant="contained" color="primary" onClick={this.saveRowRemote}>
                                Save
                            </Button>
                        </span>
                        <span className='controlWraperStyle' >
                            <Button size="small" variant="contained" color="secondary" onClick={this.closeDetails} >
                                Cancel
                            </Button>
                        </span>                  
                        <br/>

                        <span className="controlWraperStyle" >
                            <TextField inputProps={{name:'name'}}  label="Name" variant="outlined" defaultValue={actualData.name} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <TextField inputProps={{name:'address'}} label="Address" variant="outlined" defaultValue={actualData.address} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <TextField inputProps={{name:'city'}} label="City" variant="outlined" defaultValue={actualData.city} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <TextField inputProps={{name:'state'}} label="State" variant="outlined" defaultValue={actualData.state} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <TextField inputProps={{name:'country'}} label="Country" variant="outlined" defaultValue={actualData.country} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <TextField inputProps={{name:'zip_code'}} label="Zip Code" variant="outlined" defaultValue={actualData.zip_code} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <TextField inputProps={{name:'phone'}} label="Phone" variant="outlined" defaultValue={actualData.phone} onChange={this.updateInputValue} />
                        </span>
                        <span className="controlWraperStyle" >
                            <TextField inputProps={{name:'email'}} label="E-Mail" variant="outlined" defaultValue={actualData.email} onChange={this.updateInputValue} />
                        </span>

                    </DialogContent>
                </Dialog>          
            </div>
        );
    }
}

export default Hotels;