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
   // this.handleSubmit = this.handleSubmit.bind(this);
  }

  //const species = this.state.value;

  handleChange(event) {
    this.setState({value: event.target.value});
    this.props.layer.updateData('species', event.target.value)
  }



  componentDidMount() {
    const speciesJson = require("./speciesArray.json");
    this.setState({ values: speciesJson });
  }

  render() {


    return (

        <label>
          Filter by Species:
          <select value={this.state.value} onChange={this.handleChange}>

            {this.state.values.map(item => (
              <option key={ item }  value={item}> {item} </option>
            ))}
          </select>
        </label>

    );
  }
}

export default Dropdown;


//() = { this.props.data.updateSpecies}
//{console.log("test---",this.state.value)
