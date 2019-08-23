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
    const columns = [];
    if(_.isEmpty(tableData)){
    }else{
      tableData.sampleData.map(item => {
        data.push({
          active:item.active,
          create_time:item.create_time,
          description:item.description,
          enc_type:item.enc_type,
          id:item.id,
          last_modified_by: item.last_modified_by,
          modified_time:item.modified_time,
          name:item.name,
          settings_blob:item.settings_blob,
          version:item.version
        });
      
    });
    const props = Object.keys(data[0]);
    tableData.schema.map((item,i)=>{
      columns.push({
       Header:item.columnName,
       accessor:item.columnName
      })
    })
   
    }
    console.log('this is columns ', columns);
    return (
     
      <div>
         <ReactTable
            data={data}
            columns={columns}
            minRows={1}
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
