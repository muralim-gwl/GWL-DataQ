import React from 'react';
import './dataTable.css';
import _ from 'lodash';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from "react-redux";
import PropTypes from 'prop-types';


class DataSourceTable extends React.Component {

  state ={
  
}

  render() {
    const { tableData } = this.props;
    const data=[];
    if(_.isEmpty(tableData)){
    }else{
      tableData.sampleData.map(item => {
        data.push({
          Active:item.active,
          Time:item.create_time,
          Description:item.description,
          Type:item.enc_type,
          id:item.id,
          modified: item.last_modified_by,
          time:item.modified_time,
          name:item.name,
          setting:item.settings_blob,
          version:item.version
        });
    
    })
    }
      const columns = [
        {
          Header:'Active',
          accessor:'Active'
        },
        {
          Header:'Time',
          accessor:'Time'
        },  
        {
          Header:'Description',
          accessor:'Description'
        }, 
        {
          Header:'Type',
          accessor:'Type'
        },  
        {
          Header:'id',
          accessor:'id'
        },  
        {
          Header:'Last Modified',
          accessor:'modified'
        }, 
        {
          Header:'Modified Time',
          accessor:'time'
        },  
        {
          Header:'Name',
          accessor:'name'
        },  
        {
          Header:'Setting Blob',
          accessor:'setting'
        },  
        {
          Header:'Version',
          accessor:'version'
        },
      ]

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

const mapStateToProps = ({ screenConfiguration = {} }) => {
  const { preparedFinalObject = {} } = screenConfiguration;
  const {
    tableData = []
  } = preparedFinalObject;
  return {
    tableData
  };
};

export default connect(mapStateToProps,null)(DataSourceTable);
