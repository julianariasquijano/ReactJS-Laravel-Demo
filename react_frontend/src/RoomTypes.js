
import React,{Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function ObjectMap(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
    ObjectMap('Frozen yoghurt', 159, 6.0, 24, 4.0),
    ObjectMap('Ice cream sandwich', 237, 9.0, 37, 4.3),
];

class RoomTypes extends Component {

    constructor(props){
        super()
        this.state = {
            source:props.source,
        }

    }

    render(){

        let content=''
        if (this.state.source === 'hotels'){
            content = <h1>HOTELS</h1>
        }
        else if (this.state.source === 'room_types'){
            
            content = <div>ROOM TYPES</div>
        }

        return (
            <div>
                {content}
                <Paper >
            <Table >
              <TableHead>
                <TableRow>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Fat&nbsp;(g)</TableCell>
                  <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                  <TableCell align="right">Protein&nbsp;(g)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.calories}</TableCell>
                    <TableCell align="right">{row.fat}</TableCell>
                    <TableCell align="right">{row.carbs}</TableCell>
                    <TableCell align="right">{row.protein}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>                
            </div>
        );
    }
}

export default RoomTypes;