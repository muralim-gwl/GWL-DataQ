import React from 'react';
import './connectionTable.css';
import Button from '@material-ui/core/Button';
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from '@material-ui/core/TextField';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';
const data = [{
    name: 'Tanner Connection',
    age: '126.0.0.1',
    friend: {
      name: 'Maurer Vcdet',
      age: 23,
    }
  },
  {
    name: 'Data Sql',
    age: '165.2.0.1',
    friend: {
      name: 'Jason Maurer',
      age: 23,
    }
  },
  {
    name: 'Oracle DB',
    age: '621.0.0.1',
    friend: {
      name: 'Vestru Maurer',
      age: 23,
    }
  },
  {
    name: 'Mongo DB',
    age: '126.1.1.1',
    friend: {
      name: 'Jason Aswqer',
      age: 23,
    }
  },
  {
    name: 'Nodejs',
    age: '032.0.0.1',
    friend: {
      name: 'Crewdt Butre',
      age: 23,
    }
  },
  {
    name: 'My SQL',
    age: '163.0.0.1',
    friend: {
      name: 'Jason Maurer',
      age: 23,
    }
  },
  {
    name: 'Check Data',
    age: '126.0.0.1',
    friend: {
      name: 'Jason Maurer',
      age: 23,
    }
  },
  {
    name: 'Database',
    age: '126.0.3.1',
    friend: {
      name: 'Jason Maurer',
      age: 23,
    }
  }]

  const columns = [{
    Header: 'DataBase Connection Name',
    accessor: 'name' // String-based value accessors!
  }, {
    Header: 'Server',
    accessor: 'age',
    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
  }, {
    id: 'friendName', // Required because our accessor is not a string
    Header: 'Login',
    accessor: d => d.friend.name // Custom value accessors!
  }, {
    Header: props => <span>Password</span>, // Custom header components!
    accessor: 'friend.age'
  }]


class ConnectionTable extends React.Component {

  state ={
      dataDefault: data,
      dataFilter: data
  }

  
  openConnectionTab=()=>{

  }
  filterConnectionTable=(e)=>{
   const searchText = e.target.value;
   if(searchText.length == 0){
       this.setState({dataFilter:this.state.dataDefault})
   }else{
     let res = [];
     let backSearchHandle = this.state.dataDefault;
     res = backSearchHandle.filter((item) => {
       return item.name.toString().toLowerCase().includes(searchText.toLowerCase());
     });
   this.setState({
     dataFilter: res,
   });
   }
  }


  render() {
 
    return (
      <div className='connectionContainer'>
        <div className='connectionHeader'>
            <TextField
                id="input-with-icon-textfield"
                label="Search for column name,type"
                onChange ={this.filterConnectionTable}
                InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                    <SearchIcon color='primary'/>
                    </InputAdornment>
                ),
                }}
            />

            <Button onClick={this.openConnectionTab} style={{textTransform:'none', fontSize:'12px'}} variant="contained"  size= 'medium' color="secondary">
                Add New Connection
            </Button>
        </div>
        <ReactTable
            data={this.state.dataFilter}
            columns={columns}
            minRows={0}
            defaultPageSize={5}
            style={{
              height: "298px" // This will force the table body to overflow and scroll, since there is not enough room
            }}
         />
      </div>
    );
  }
}

ConnectionTable.propTypes = {
  //classes: PropTypes.object.isRequired,
};


export default ConnectionTable;
