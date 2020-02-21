import React from 'react'

class TextComponent extends React.PureComponent{
    constructor(props){
        super(props);

    }

    render() {
        if(this.props.display_condition !== '' && this.props.display_condition){
            return (
                <div className="col-sm-12" style={{display: this.props.display_condition.check.includes(this.props.state[this.props.display_condition.attribute]) ? 'block' : 'none'}}>
                    <div className="form-group"><label htmlFor>{this.props.label}</label><span style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                        <input id={this.props.title} onChange={this.props.handleChange} className="form-control" placeholder={this.props.label} type={this.props.type} value ={this.props.state[this.props.title] || ''}/>
                    </div>
                    <br/>
                </div>

            )
        }else{
            return (
                <div className="col-sm-12">
                    <div className="form-group"><label htmlFor>{this.props.label}</label><span style={{'float': 'right'}}>{this.props.prompt !== '' ? this.props.prompt(this.props.title) : ''}</span>
                        <input id={this.props.title}
                               onChange={this.props.handleChange}
                               className="form-control"
                               placeholder={this.props.label}
                               type={this.props.type}
                               required={this.props.required ? this.props.required : null}
                               value ={this.props.state[this.props.title] || ''}/>
                        <div className="help-block form-text with-errors form-control-feedback">{this.props.required ? this.props.required : null}</div>
                    </div>
                    <br/>
                </div>

            )
        }

    }

}

export default TextComponent;