import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { createMatchSelector } from 'react-router-redux';

//import LandingNav from './components/LandingNav'

//import { signup } from 'store/modules/user';
import {sendSystemMessage} from 'store/modules/messages';

import 'pages/Landing/Login.css'

class Signup extends Component {
  constructor(props){
      super(props)
          this.state = {
              activeStep: 0,
              }
      this.handleChange = this.handleChange.bind(this)
      this._next = this._next.bind(this)
      this._prev = this._prev.bind(this)
      this.nextButton = this.nextButton.bind(this)
      this.previousButton = this.previousButton.bind(this)
      this.submitButton = this.submitButton.bind(this)
      this.setStep = this.setStep.bind(this)
      this.highlightRequired = this.highlightRequired.bind(this)
  }



  handleChange(event) {
    const id = event.target.id;
    const value = event.target.value;
    this.setState({
      [id]: value
    });
  };


  _next() {
        let currentStep = this.state.activeStep
        let start = this.props.steps.length - 2
        let end = this.props.steps.length - 1
        currentStep = currentStep >= start? end: currentStep + 1
        this.setState({
            activeStep: currentStep
        })
  }
  _prev() {
        let currentStep = this.state.activeStep
        currentStep = currentStep <= 0? 1: currentStep - 1
        this.setState({
            activeStep: currentStep
        })
    }

    highlightRequired() {
     let currentStep = this.props.steps[this.state.activeStep];
      console.log(currentStep)
    }
  setStep(step) {
          if(this.state.activeStep !== step) {
              this.setState({activeStep: step})
          }
  }

  previousButton(){
    let currentStep = this.state.activeStep;
    if(currentStep !==0){
        return (
            <a className="btn btn-primary step-trigger-btn" href = {'#'} onClick = {this._prev}> Previous</a>
        )
    }
    return null;
  }

  nextButton(){
    let currentStep = this.state.activeStep;
    let buttonActive = this.props.steps[this.state.activeStep].nextButtonActive !== undefined ?
        this.props.steps[this.state.activeStep].nextButtonActive : true;
    let endStep = this.props.steps.length-1
    if(currentStep !== endStep){
        return (
            buttonActive ? <a className="btn btn-primary step-trigger-btn" href ={'#'} onClick = {this._next} > Continue</a>
                : <a className="btn btn-primary step-trigger-btn disabled" href ={'#'} onClick = {this.highlightRequired}> Continue</a>
        )
    }
    return null;
  }

  submitButton(){
      let currentStep = this.state.activeStep;
      let buttonActive = this.props.steps[this.state.activeStep].nextButtonActive !== undefined ?
          this.props.steps[this.state.activeStep].nextButtonActive : true;
      let endStep = this.props.steps.length
      if(currentStep === endStep-1){
          return(
              buttonActive ? <button className="btn btn-primary step-trigger-btn" href ={'#'}> Submit</button>
                  : <button className="btn btn-primary step-trigger-btn" href={'#'} disabled> Submit</button>
          )
      }
      return null
  }


  render () {
    return (
      <div className="element-box">
                <form onSubmit={this.props.submit}>
                    <div className="steps-w">
                        <div className="step-triggers">
                            {
                                this.props.steps.map((step,i) => {
                                    if ((this.props.steps[i-1] && this.props.steps[i-1].nextButtonActive !== undefined && this.props.steps[i-1].nextButtonActive) ||
                                        (this.props.steps[i-1] && this.props.steps[i-1].nextButtonActive === undefined)){
                                            return (
                                                <a
                                                    href={'#'}
                                                    onClick={this.setStep.bind(this,i)}
                                                    className={`step-trigger ${i <= this.state.activeStep ? 'complete' : ''} ${i === this.state.activeStep ? 'active' : ''}`} >{step.title}</a>
                                            )
                                    }else if (this.props.steps[i-1] && this.props.steps[i-1].nextButtonActive !== undefined && !this.props.steps[i-1].nextButtonActive){
                                            return (
                                                <a
                                                    href={'#'}
                                                    className={`step-trigger ${i <= this.state.activeStep ? 'complete' : ''} ${i === this.state.activeStep ? 'active' : ''}`} >{step.title}</a>
                                            )
                                    }else {
                                        return (
                                            <a
                                                href={'#'}
                                                onClick={this.setStep.bind(this,i)}
                                                className={`step-trigger ${i <= this.state.activeStep ? 'complete' : ''} ${i === this.state.activeStep ? 'active' : ''}`} >{step.title}</a>
                                        )
                                    }

                                })
                            }
                        </div>
                        <div className="step-contents">
                            {this.props.steps[this.state.activeStep].content}
                        </div>
                        <div className="form-buttons-w text-right">
                            {this.previousButton()}{this.nextButton()}
                            {this.submitButton()}
                        </div>
                    </div>
                </form>
            </div>
    )
  }
}

const mapDispatchToProps = {
    sendSystemMessage
};

const mapStateToProps = state => {
  return {
    isAuthenticated: !!state.user.authed,
    attempts: state.user.attempts // so componentWillReceiveProps will get called.
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
