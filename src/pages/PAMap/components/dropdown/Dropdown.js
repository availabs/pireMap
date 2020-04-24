import React from "react";

//import Species  from "./speciesArray";


class Dropdown extends React.Component {
  constructor(props) {
    super(props);

   //this.state = {value: Species };
    this.state = {
      values: [],
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //const species = this.state.value;

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    //  alert('Filter by Species: ' + this.state.value);
    this.props.change(this.state.value);

    event.preventDefault();
  }

  componentDidMount() {
    const speciesJson = require("./speciesArray.json");
    this.setState({ values: speciesJson });
  }

  render() {

  
    return (

      
      <form onSubmit={this.handleSubmit.bind(this)}>
        <label>
          Filter by Species:
          <select value={this.state.value} onChange={this.handleChange}>

            {this.state.values.map(item => (
              <option  value={item}> {item} </option>
            ))}
           {console.log("this.state.value---", this.state.value)}
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Dropdown;


//() = { this.props.data.updateSpecies}
//{console.log("test---",this.state.value)