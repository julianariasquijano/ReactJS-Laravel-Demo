
import React,{Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { width, fontSize } from '@material-ui/system';

function ObjectMap(id,name,phone) {
  return { id,name, phone };
}

const rows = [
    ObjectMap(1,'Cameron', '23452345'),
    ObjectMap(2,'Hilton', '768769'),
];

class Hotels extends Component {

    constructor(props){
        super()
        this.state = {
            detailsOpened:false,
        }

    }

    openDetails = () => {
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

        let detailsClass = {
            top: '50px',
            left: '30px',
            position: 'absolute',
            width: '90%',
            heigh: '90%',
            border: '2px solid #000',
            borderRadius: '5px',
            outline: 'none',
            backgroundColor:'white'
          }

        return (
            <div>
                <h1>HOTELS</h1>
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
                                    <Button id={row.id}
                                        variant="contained" 
                                        color='primary' 
                                        onClick={this.openDetails} 
                                    >
                                    Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
                <Modal open={this.state.detailsOpened} onClose={this.closeDetails}  >
                    <div style={detailsClass}>
                    Content
                    </div>
                </Modal>          
            </div>
        );
    }
}

export default Hotels;