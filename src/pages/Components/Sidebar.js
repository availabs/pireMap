import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {ArrowRight} from '../../components/common/icons';

import { Tooltip } from '../../components/common/styled-components';

const StyledSidePanelContainer = styled.div`
  z-index: 99;
  height: 100%;
  width: ${ props => props.width + 40 }px;
  display: flex;
  transition: width 250ms;
  position: absolute;
  padding: 20px;
`;

const SideBarContainer = styled.div`
  position: relative;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  align-items: stretch;
  flex-grow: 1;
  overflow: ${ props => props.isOpen && !props.transitioning ? 'visible' : 'hidden' };
`;

const SideBarInner = styled.div`
  background-color: ${props => props.theme.sidePanelBg};
  border-radius: 1px;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CollapseButton = styled.div`
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  justify-content: center;
  background-color: ${props => props.theme.sideBarCloseBtnBgd};
  border-radius: 1px;
  color: ${props => props.theme.sideBarCloseBtnColor};
  display: flex;
  position: absolute;
  height: 20px;
  width: 20px;
  right: 10px;
  top: 25px;

  :hover {
    cursor: pointer;
    box-shadow: none;
    background-color: ${props => props.theme.sideBarCloseBtnBgdHover};
  }
`;

class SideBar extends Component {
    static defaultProps = {
        width: 500,
        minifiedWidth: 0,
        isOpen: true,
        onOpenOrClose: function noop() {}
    };
    static propTypes = {
        width: PropTypes.number,
        isOpen: PropTypes.bool,
        minifiedWidth: PropTypes.number,
        onOpenOrClose: PropTypes.func
    };

    _onOpenOrClose = () => {
        this.props.onTransitionStart();
        setTimeout(() => {
            this.props.onOpenOrClose(!this.props.isOpen);
        }, 250);
    };

    render(){
        const { isOpen, transitioning, width } = this.props;

        const _width = isOpen && transitioning ? 0
            : isOpen && !transitioning ? width
                : !isOpen && transitioning ? 300
                    : 0;
        return(
            <StyledSidePanelContainer
                width={ _width }
                className="side-panel--container"
                isOpen={ isOpen }>
                <SideBarContainer className="side-bar"
                                  style={ { width: `${ this.props.width ? this.props.width : width }px`, height: 300, overflowY: 'scroll'} }
                                  isOpen={ isOpen }
                                  transitioning={ transitioning }
                >
                    <div style={{padding: 10}}>
                        <h4 style={{color: '#efefef'}}>{this.props.header}</h4>
                        <p>
                            This Paleo Hydrodynamics Data Assimilation product (PHYDA) visualization tool maps
                            2,000 years of reconstructed temperature and hydroclimate onto a global interface. The dataset
                            underlying this visualization is based on a global climate model with assimilated proxy data from
                            natural archives, such as corals, lake sediments, ice cores, speleothems and tree rings. Using
                            annually resolved global reconstructions of near-surface air temperature and drought (PDSI), this
                            innovative transformation optimizes exploration of an expansive database into an approachable
                            web-based visualization platform for streamlined presentation and collaboration.
                            <br /><br />
                            The user can rotate the globe, zoom into regions of interest and click on any location of the globe
                            to download a time series of the variable of interest.<br /><br />
                            When downloading data, please be aware that these values represent estimates of past climate
                            and include significant uncertainties. These uncertainties increase back in time, as fewer proxy
                            data are available, and they are also larger in regions where proxy data is generally limited, such
                            as in the tropics and the southern hemisphere.<br /><br />
                            This visualization was made possible through the published work of Steiger, N. J., J.E. Smerdon,
                            E.R. Cook &amp; B.I. Cook, 2018: A reconstruction of global hydroclimate and dynamical
                            variables over the Common Era. Sci. Data, 5, 1–15. doi:10.1038/sdata.2018.86.
                            <a href="https://www.nature.com/articles/sdata201886" target="_blank">https://www.nature.com/articles/sdata201886</a>.</p>
                    </div>
                </SideBarContainer>
                <CollapseButton className="side-bar__close"
                                onClick={ this._onOpenOrClose }
                                data-tip data-for="hide-show-layer-controls">
                    <ArrowRight height="12px"
                                style={ { transform: `rotate(${ isOpen ? 180 : 0 }deg)` } }/>
                </CollapseButton>
                <Tooltip
                    id='hide-show-layer-controls'
                    effect="solid"
                    place="right">
                    <span>{ `${ isOpen ? "Hide" : "Show" } Controls` }</span>
                </Tooltip>

            </StyledSidePanelContainer>
        )
    }
}

export default SideBar
