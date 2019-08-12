import React from 'react';
import './dataTable.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import PropTypes from 'prop-types';


class DataSourceTable extends React.Component {

  state ={
  
}

  render() {
    const data = [{
        name: 'Tanner Linsley',
        age: 26,
        friend: {
          name: 'Jason Maurer',
          age: 23,
        }
      },
      {
        name: 'Tanner Linsley',
        age: 26,
        friend: {
          name: 'Jason Maurer',
          age: 23,
        }
      },
      {
        name: 'Tanner Linsley',
        age: 26,
        friend: {
          name: 'Jason Maurer',
          age: 23,
        }
      },
      {
        name: 'Tanner Linsley',
        age: 26,
        friend: {
          name: 'Jason Maurer',
          age: 23,
        }
      },
      {
        name: 'Tanner Linsley',
        age: 26,
        friend: {
          name: 'Jason Maurer',
          age: 23,
        }
      },
      {
        name: 'Tanner Linsley',
        age: 26,
        friend: {
          name: 'Jason Maurer',
          age: 23,
        }
      },
      {
        name: 'Tanner Linsley',
        age: 26,
        friend: {
          name: 'Jason Maurer',
          age: 23,
        }
      },
      {
        name: 'Tanner Linsley',
        age: 26,
        friend: {
          name: 'Jason Maurer',
          age: 23,
        }
      }]
    
      const columns = [{
        Header: 'Name',
        accessor: 'name' // String-based value accessors!
      }, {
        Header: 'Age',
        accessor: 'age',
        Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
      }, {
        id: 'friendName', // Required because our accessor is not a string
        Header: 'Friend Name',
        accessor: d => d.friend.name // Custom value accessors!
      }, {
        Header: props => <span>Friend Age</span>, // Custom header components!
        accessor: 'friend.age'
      }]

    return (
     
      <div>
         <ReactTable
            data={data}
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

DataSourceTable.propTypes = {
  //classes: PropTypes.object.isRequired,
};


export default DataSourceTable;
