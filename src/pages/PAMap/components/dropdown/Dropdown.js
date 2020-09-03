import React from "react";
import { MultiSelectFilter } from 'components/filters'

//import Species  from "./speciesArray";


class Dropdown extends React.Component {
  constructor(props) {
    super(props);

   //this.state = {value: Species };
    this.state = {
      values:  require("./speciesArray.json"),
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
   // this.handleSubmit = this.handleSubmit.bind(this);
  }

  //const species = this.state.value;

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.layer.updateData('species', event.target.value)
  }



  // componentDidMount() {
  //   const speciesJson =;
  //   this.setState({ values: speciesJson });
  // }

  render() {


    return (

        <label style={{width: '100%'}}>
          <div style={{paddingBottom: 10}}>
            <h4 style={{color: '#efefef'}}>Tree Ring Viewer</h4>
            <p style={{color: '#cce9f2', lineHeight: '1.2em', fontSize: '1.2em'}}> &nbsp;&nbsp;&nbsp;</p> 
          </div>

          Filter by Species:<br/>
          <select value={this.state.value} onChange={this.handleChange} style={{padding: 10, width: '100%', fontSize: '1.5em'}}>
            {this.state.values
              .map(item => (
              <option key={ item }  value={item}> {toTitleCase(item)} </option>
            ))}
          </select>

        </label>

    );
  }
}

export default Dropdown;


//() = { this.props.data.updateSpecies}
//{console.log("test---",this.state.value)
function toTitleCase(str) {
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }