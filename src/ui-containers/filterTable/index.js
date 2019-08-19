import React from 'react';
import './filterTable.css';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from '@material-ui/core/TextField';
import { httpRequest} from "../../ui-utils/api";
import {mapDispatchToProps} from "../../ui-utils/commons";
import {connect} from "react-redux";
import PropTypes from 'prop-types';


class FilterTable extends React.Component {
 
  state ={
      dataDefault : '',
      data:'',
      checked:[],
      optionsChecked:[]

  }
  componentWillMount=()=>{
    console.log('this is filter tab', this.props.dataTableFilter);
    this.setState({dataDefault:this.props.dataTableFilter, data: this.props.dataTableFilter })
  }
  componentWillReceiveProps=(nextProps)=>{
    console.log('this is filter PROPS', nextProps.dataTableFilter);
    this.setState({dataDefault:nextProps.dataTableFilter, data: nextProps.dataTableFilter })
  }

  filterTable = (e) =>{
      const searchText = e.target.value;
      if(searchText.length == 0){
          this.setState({data:this.state.dataDefault, checked:[],optionsChecked:[]})
      }else{
        let res = [];
        let backSearchHandle = this.state.dataDefault;
        res = backSearchHandle.filter((item) => {
          return item.toString().toLowerCase().includes(searchText.toLowerCase());
        });
      this.setState({
        data: res,
      });
      }
  }
  checkAll = ()=>{
    var newArr =[];
    const checked = this.state.checked.every((i)=>i==true);
    if(this.state.checked.length ==0){
      for(let i =0; i<this.state.data.length; i++ ){
        newArr.push(true);
      }
      this.setState({optionsChecked:this.state.dataDefault})
    } 
    else if(checked){
      this.setState({optionsChecked:[]})
    }
    else{
      for(let i =0; i<this.state.data.length; i++ ){
        newArr.push(true);
      }
      this.setState({optionsChecked:this.state.dataDefault})
    }
    this.setState({checked:newArr})
  }

  handleUncheck =(e,i)=>{
     const newArr = this.state.checked;
     var selectedArr = [...this.state.optionsChecked];
     newArr[i] = !this.state.checked[i];
     this.setState({checked:newArr});

     if (e.target.checked === true) {
      selectedArr.push(e.target.value);
        this.setState({
          optionsChecked: selectedArr
        });
    } else {
      let valueIndex = selectedArr.indexOf(e.target.value);
      selectedArr.splice(valueIndex, 1);
        this.setState({
          optionsChecked: selectedArr
        });
        
    }
     
  }
  addSelectedColumn = async ()=>{
    const { setAppData, enableData } = this.props;
    enableData();
    setAppData('dataDropDown', this.state.optionsChecked);
  }

  render() {
    return (
      <div className='filterContainer'>
        <div className='filterSelect'>
          <div className='filterHeader'>Select columns which will Keep</div>
          <Button onClick={this.addSelectedColumn} style={{textTransform:'none', fontSize:'12px'}} variant="contained"  size= 'medium' color="secondary">
            Add Selected
          </Button>
        </div>
        <div className='filterContent'>
          {
              this.state.data.map((item,i) =>{
                 return (
                 <div className='filterRow' key={i}>
                    <input type='checkbox' id={item} onClick={(e)=>this.handleUncheck(e,i)}  value={item} checked={this.state.checked[i]} />
                    <label htmlFor={item}><span className="icon">  {item}</span></label>
                 </div>
                 );
              })
          }
        </div>
        <div className='filterSearch'>
    
          <TextField
            id="input-with-icon-textfield"
            label="Search for column name,type"
            onChange ={this.filterTable}
            InputProps={{
              //disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color='primary'/>
                </InputAdornment>
              ),
            }}
          />
          {/* <div className='filterInput'><input placeholder='Search for column name,type' onChange ={this.filterTable}/></div> */}
            <Fab
              variant="extended"
              size="small"
              color="primary"
              aria-label="add"
              onClick={this.checkAll}
              style={{textTransform:'none', fontSize:'12px', padding: '0px 17px'}}
            >
             Select All
          </Fab>
        </div>
      </div>
    );
  }
}

FilterTable.propTypes = {
  //classes: PropTypes.object.isRequired,
};

const mapStateToProps=({screenConfiguration={}})=>{
  const {preparedFinalObject={}}=screenConfiguration;
  const {connections={}}=preparedFinalObject;
  return {
    
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(FilterTable);
