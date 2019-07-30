import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Hotels from './Hotels'
import RoomTypes from './RoomTypes'
import PricesList from './PricesList'
import Bookings from './Bookings'

//Seting tabs basic functionality
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Admin() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Hotels" />
          <Tab label="Room Types" />
          <Tab label="Prices List" />
          <Tab label="Calendar" />
        </Tabs>
      </AppBar>
      {value === 0 && <TabContainer> <Hotels></Hotels> </TabContainer>}
      {value === 1 && <TabContainer> <RoomTypes></RoomTypes> </TabContainer>}
      {value === 2 && <TabContainer> <PricesList></PricesList> </TabContainer>}
      {value === 3 && <TabContainer> <Bookings></Bookings> </TabContainer>}
    </div>
  );
}