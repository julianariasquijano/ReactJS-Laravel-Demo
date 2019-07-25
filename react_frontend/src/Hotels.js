
import React,{Component} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
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

function ObjectMap(id,name,phone,address,city,state,country,zipCode,email) {
  return { id,name, phone,address,city,state,country,zipCode,email };
}

const rows = [
    ObjectMap(1,'Cameron', '23452345','las',' df ','asdf ',' asf','asfd ','as f'),
    ObjectMap(2,'Hilton', '768769','qwer','qwer','er','req','qre','ee')
];

let actualData={}

class Hotels extends Component {

    constructor(props){
        super()
        this.state = {
            detailsOpened:false,
        }

    }

    openDetails = () => {
        actualData= {}
        this.setState({
            detailsOpened:true,
        })
    }

    openDetailsWithRow = (row) => {
        actualData = row
        this.setState({
            detailsOpened:true,
        })
    }
    closeDetails = () => {
        this.setState({
            detailsOpened:false,
        })
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
          }));


        return (
            <div>
                <span style={{fontSize:'30px',fontWeight:'bold'}}>HOTELS</span>
                &nbsp;&nbsp;&nbsp;
                <Fab 
                    variant="round" 
                    color='primary' 
                    onClick={this.openDetails} 
                >
                    <AddIcon className={clsx(classes.button, classes.iconSmall)} />
                </Fab>
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
                            {rows.map(row => (
                            <TableRow key={row.id}>
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
                <Dialog open={this.state.detailsOpened} onClose={this.closeDetails}  >
                    <DialogContent>
                    <h3>Hotel Details</h3>
                    <span className='controlWraperStyle'  >
                        <Button variant="contained" color="primary" onClick={this.closeDetails}>
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
                        <TextField id='name' label="Name" variant="outlined" value={actualData.name} />
                    </span>
                    <span className="controlWraperStyle" >
                        <TextField label="Address" variant="outlined" value={actualData.address} />
                    </span>
                    <span className="controlWraperStyle" >
                        <TextField label="City" variant="outlined" value={actualData.city} />
                    </span>
                    <span className="controlWraperStyle" >
                        <TextField label="State" variant="outlined" value={actualData.state} />
                    </span>
                    <span className="controlWraperStyle" >
                        <TextField label="Country" variant="outlined" value={actualData.country} />
                    </span>
                    <span className="controlWraperStyle" >
                        <TextField label="Zip Code" variant="outlined" value={actualData.zipCode} />
                    </span>
                    <span className="controlWraperStyle" >
                        <TextField label="Phone" variant="outlined" value={actualData.phone} />
                    </span>
                    <span className="controlWraperStyle" >
                        <TextField label="E-Mail" variant="outlined" value={actualData.email} />
                    </span>

                    </DialogContent>
                </Dialog>          
            </div>
        );
    }
}

export default Hotels;